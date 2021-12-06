"""Construct App."""

import os
from os import path
from typing import Any, List, Optional, Union

from config import StackSettings
from aws_cdk.core import Stage, Stack

from aws_cdk import (
    core,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_rds as rds,
    aws_ecs_patterns as ecs_patterns,
    aws_ecr_assets as ecr_assets,
    aws_iam as iam,
    aws_elasticloadbalancingv2 as elb,
    aws_ssm as ssm,
    pipelines as pipelines,
    aws_codebuild as codebuild,
    aws_secretsmanager as secretsmanager,
    aws_certificatemanager as certificatemanager,
)

settings = StackSettings()


class MmtPipelineStack(Stack):
    def __init__(
        self, scope, id, *, description=None, env=None, stack_name=None, tags=None, synthesizer=None,
            termination_protection=None, analytics_reporting=None):
        super().__init__(scope, id, description=description, env=env, stack_name=stack_name, tags=tags,
                         synthesizer=synthesizer, termination_protection=termination_protection,
                         analytics_reporting=analytics_reporting)

        branch = settings.stage

        build_env_vars = {}

        if settings.name:
            build_env_vars["MMT_STACK_NAME"] = codebuild.BuildEnvironmentVariable(
                value=settings.name)
        if settings.stage:
            build_env_vars["MMT_STACK_STAGE"] = codebuild.BuildEnvironmentVariable(
                value=settings.stage)
        if settings.owner:
            build_env_vars["MMT_STACK_OWNER"] = codebuild.BuildEnvironmentVariable(
                value=settings.owner)
        if settings.client:
            build_env_vars["MMT_STACK_CLIENT"] = codebuild.BuildEnvironmentVariable(
                value=settings.client)
        if settings.min_ecs_instances:
            build_env_vars["MMT_STACK_MIN_ECS_INSTANCES"] = codebuild.BuildEnvironmentVariable(
                value=settings.min_ecs_instances)
        if settings.max_ecs_instances:
            build_env_vars["MMT_STACK_MAX_ECS_INSTANCES"] = codebuild.BuildEnvironmentVariable(
                value=settings.max_ecs_instances)
        if settings.task_cpu:
            build_env_vars["MMT_STACK_TASK_CPU"] = codebuild.BuildEnvironmentVariable(
                value=settings.task_cpu)
        if settings.task_memory:
            build_env_vars["MMT_STACK_TASK_MEMORY"] = codebuild.BuildEnvironmentVariable(
                value=settings.task_memory)

        pipeline = pipelines.CodePipeline(
            self, "Pipeline",
            self_mutation=True,
            code_build_defaults=pipelines.CodeBuildOptions(
                # add policy for runtime route53 lookups (route53 and assumerole to do that)
                # https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html#context-lookups
                role_policy=[
                    iam.PolicyStatement(
                        actions=["route53:*"],
                        resources=["*"]),
                    iam.PolicyStatement(
                        actions=["sts:AssumeRole"],
                        resources=["*"],
                        # todo: re-add
                        # conditions={
                        #     "StringEquals": {'iam:ResourceTag/aws-cdk:bootstrap-role': 'deploy'}
                        # },
                    )
                ],
                build_environment=codebuild.BuildEnvironment(
                    environment_variables=build_env_vars)
            ),
            synth=pipelines.ShellStep(
                "Synth",
                input=pipelines.CodePipelineSource.git_hub(
                    repo_string="MAAP-Project/mmt",
                    branch=branch,
                    authentication=core.SecretValue.secrets_manager(
                        "/github.com/MAAP-Project/mmt", json_field="token")
                ),
                commands=[
                    "mkdir -p deployment/.cdk",
                    "cp $HOME/.cdk/cdk-docker-creds.json deployment/.cdk/cdk-docker-creds.json",
                    "cd deployment",
                    "pip install -r requirements.txt",
                    "npm install -g aws-cdk",
                    "npm run cdk synth"
                ],
                primary_output_directory="deployment/cdk.out"
            ),
            docker_credentials=[pipelines.DockerCredential.docker_hub(
                secret=secretsmanager.Secret.from_secret_name_v2(self,
                    "dh-secret", secret_name="/hub.docker.com/MAAP-Project/mmt"),
                secret_username_field="username",
                secret_password_field="password"
            )],
            docker_enabled_for_synth=True,
        )

        pipeline.add_stage(
            MmtApp(
                self,
                "MmtApplicationStack",
                f"{settings.stage}-mmt-app",
                stack_id=f"{settings.stage}-{settings.name}",
                env=env
            )
        )


class MmtStack(core.Stack):
    """MMT ECS Fargate Stack."""

    def __init__(
        self,
        scope: core.Construct,
        stack_id: str,
        stack_name: str,
        *,
        cpu: Union[int, float] = 512,
        memory: Union[int, float] = 1024,
        mincount: int = 1,
        maxcount: int = 50,
        permissions: Optional[List[iam.PolicyStatement]] = None,
        env: Optional[core.Environment] = None,
        **kwargs: Any,
    ) -> None:
        """Define stack."""
        super().__init__(scope, stack_id, env=env, stack_name=stack_name, **kwargs)

        if settings.permissions_boundary_name is not None:
            boundary = iam.ManagedPolicy.from_managed_policy_name(
                self,
                'Boundary',
                settings.permissions_boundary_name
            )
            iam.PermissionsBoundary.of(self).apply(boundary)

        if settings.vpc_id is not None:
            vpc = ec2.Vpc.from_lookup(self, 'VPC', vpc_id=settings.vpc_id)
        else:
            vpc = ec2.Vpc(self, f"{stack_name}-vpc")

        app_service_port = 3000
        permissions = permissions or []

        db_admin_credentials_secret = rds.DatabaseSecret(
            self, f"/{stack_name}/AdminDBCredentials", username="postgres")

        core.CfnOutput(self, "AdminDBCredentialsSecretName",
                       value=db_admin_credentials_secret.secret_name)
        core.CfnOutput(self, "AdminDBCredentialsSecretARN",
                       value=db_admin_credentials_secret.secret_arn)

        db_username = "mmt"
        db_credentials_secret = rds.DatabaseSecret(
            self, f"/{stack_name}/AppDBCredentials", username=db_username)

        core.CfnOutput(self, "AppDBCredentialsSecretName",
                       value=db_credentials_secret.secret_name)
        core.CfnOutput(self, "AppDBCredentialsSecretARN",
                       value=db_credentials_secret.secret_arn)

        ingress_sg = ec2.SecurityGroup(self, f"{stack_name}-rds-ingress",
                                       vpc=vpc,
                                       security_group_name=f"{stack_name}-rds-ingress-sg",
                                       )

        ingress_sg.add_ingress_rule(
            # vpcCidrBlock refers to all the IP addresses in vpc
            ec2.Peer.ipv4(vpc.vpc_cidr_block),
            ec2.Port.tcp(5432),
            "Allows only local resources inside VPC to access this Postgres port (default -- 3306)"
        )

        db = rds.DatabaseInstance(
            self, "RDS",
            database_name="appdb",
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE),
            security_groups=[ingress_sg],
            engine=rds.DatabaseInstanceEngine.postgres(
                version=rds.PostgresEngineVersion.VER_10_15),
            credentials=rds.Credentials.from_secret(
                db_admin_credentials_secret),
            port=5432,
            instance_type=ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE2,
                ec2.InstanceSize.MEDIUM,
            ),
            removal_policy=core.RemovalPolicy.DESTROY,
            deletion_protection=False,
            publicly_accessible=False,
        )

        core.CfnOutput(self, "DatabaseArn", value=db.instance_arn)
        core.CfnOutput(self, "DatabaseEndpointAddress",
                       value=db.db_instance_endpoint_address)
        core.CfnOutput(self, "DatabaseEndpointPort",
                       value=db.db_instance_endpoint_port)

        cluster = ecs.Cluster(
            self, f"{stack_name}-cluster", vpc=vpc, enable_fargate_capacity_providers=True)

        core.CfnOutput(self, "ClusterArn", value=cluster.cluster_arn)

        task_env = {}
        task_env["LOG_LEVEL"] = "error"
        task_env["ENV"] = settings.stage
        task_env["RAILS_ENV"] = settings.stage
        # to serve css, etc., assets
        task_env["RAILS_SERVE_STATIC_FILES"] = "true"
        task_env["RAILS_LOG_TO_STDOUT"] = "true"
        task_env["DATABASE_HOST"] = db.db_instance_endpoint_address
        task_env["DATABASE_NAME"] = "mmt"
        task_env["DATABASE_USERNAME"] = db_username

        task_env["CMR_ROOT"] = ssm.StringParameter.value_for_string_parameter(
            self, f"/{stack_name}/CMR_ROOT")
        task_env["MMT_ROOT"] = ssm.StringParameter.value_for_string_parameter(
            self, f"/{stack_name}/MMT_ROOT")
        task_env["CUMULUS_REST_API"] = ssm.StringParameter.value_for_string_parameter(
            self, f"/{stack_name}/CUMULUS_REST_API")

        secret_cmr_urs_password = ssm.StringParameter.from_secure_string_parameter_attributes(
            self, id=f"/{stack_name}/CMR_URS_PASSWORD", parameter_name=f"/{stack_name}/CMR_URS_PASSWORD", version=1)
        secret_secret_key_base = ssm.StringParameter.from_secure_string_parameter_attributes(
            self, id=f"/{stack_name}/SECRET_KEY_BASE", parameter_name=f"/{stack_name}/SECRET_KEY_BASE", version=1)
        secret_urs_username = ssm.StringParameter.from_secure_string_parameter_attributes(
            self, id=f"/{stack_name}/URS_USERNAME", parameter_name=f"/{stack_name}/URS_USERNAME", version=1)
        secret_urs_password = ssm.StringParameter.from_secure_string_parameter_attributes(
            self, id=f"/{stack_name}/URS_PASSWORD", parameter_name=f"/{stack_name}/URS_PASSWORD", version=1)

        task_definition = ecs.FargateTaskDefinition(self, f"{stack_name}-task-definition",
                                                    cpu=cpu, memory_limit_mib=memory)

        task_definition.add_container(
            f"{stack_name}-container",
            image=ecs.ContainerImage.from_docker_image_asset(
                ecr_assets.DockerImageAsset(
                    self,
                    f"{stack_name}-image",
                    directory=path.abspath("../"),
                    file="deployment/Dockerfile"
                )
            ),
            port_mappings=[ecs.PortMapping(
                container_port=app_service_port, host_port=app_service_port)],
            secrets={
                "POSTGRES_PASSWORD": ecs.Secret.from_secrets_manager(db_admin_credentials_secret, "password"),
                "DATABASE_PASSWORD": ecs.Secret.from_secrets_manager(db_credentials_secret, "password"),
                "CMR_URS_PASSWORD": ecs.Secret.from_ssm_parameter(secret_cmr_urs_password),
                "SECRET_KEY_BASE": ecs.Secret.from_ssm_parameter(secret_secret_key_base),
                "URS_PASSWORD": ecs.Secret.from_ssm_parameter(secret_urs_password),
                "URS_USERNAME": ecs.Secret.from_ssm_parameter(secret_urs_username),
            },
            environment=task_env,
            logging=ecs.LogDrivers.aws_logs(stream_prefix=stack_name)
        )

        load_balancer = elb.ApplicationLoadBalancer(self,
            "mmt-lb",
            vpc=vpc,
            internet_facing=True
        )

        http_listener=load_balancer.add_listener('HttpListener',
            protocol=elb.ApplicationProtocol.HTTP,
            port=80
        )
        http_listener.add_redirect_response(
            'HttpRedirect',
            status_code='HTTP_301',
            protocol='HTTPS',
            port="443"
        )

        if settings.certificate_arn is not None and settings.certificate_arn != '':
            certificate=certificatemanager.Certificate.from_certificate_arn(
                self,
                f"mmt-{settings.stage}-certificate",
                settings.certificate_arn
            )

        fargate_service = ecs_patterns.ApplicationLoadBalancedFargateService(
            self,
            f"{stack_name}-service",
            cluster=cluster,
            desired_count=mincount,
            task_definition=task_definition,
            load_balancer=load_balancer,
            listener_port=443,
            certificate=certificate
        )

        fargate_service.target_group.configure_health_check(
            path="/",
            healthy_http_codes="200,301",
            port=f"{app_service_port}"
        )

        for perm in permissions:
            fargate_service.task_definition.task_role.add_to_policy(perm)

        scalable_target = fargate_service.service.auto_scale_task_count(
            min_capacity=mincount, max_capacity=maxcount
        )

        # https://github.com/awslabs/aws-rails-provisioner/blob/263782a4250ca1820082bfb059b163a0f2130d02/lib/aws-rails-provisioner/scaling.rb#L343-L387
        scalable_target.scale_on_request_count(
            "RequestScaling",
            requests_per_target=50,
            scale_in_cooldown=core.Duration.seconds(240),
            scale_out_cooldown=core.Duration.seconds(30),
            target_group=fargate_service.target_group,
        )

        fargate_service.service.connections.allow_from_any_ipv4(
            port_range=ec2.Port(
                protocol=ec2.Protocol.ALL,
                string_representation="All port 80",
                from_port=80,
            ),
            description="Allows traffic on port 80 from ALB",
        )

class MmtApp(Stage):
    def __init__(self, scope, id, stack_name, *, stack_id, env=None, outdir=None):
        super().__init__(scope, id, env=env,outdir=outdir)

        for key, value in {
            "Project": stack_id,
            "Stack": settings.stage,
            "Owner": settings.owner,
            "Client": settings.client,
        }.items():
            if value:
                core.Tags.of(self).add(key, value)

        MmtStack(
            self,
            stack_id,
            stack_name,
            cpu=settings.task_cpu,
            memory=settings.task_memory,
            mincount=settings.min_ecs_instances,
            maxcount=settings.max_ecs_instances,
            permissions=[],
            env=env
        )


app = core.App()

if settings.deployment_strategy == "pipeline":
    MmtPipelineStack(
        app, "PipelineStack",
        stack_name=f"{settings.stage}-mmt-pipeline",
        env=core.Environment(
            account=os.environ.get(
                "CDK_DEPLOY_ACCOUNT", os.environ["CDK_DEFAULT_ACCOUNT"]),
            region=os.environ.get("CDK_DEPLOY_REGION", os.environ["CDK_DEFAULT_REGION"]))
    )
elif settings.deployment_strategy == "stack":
    MmtStack(
        app,
        "ApplicationStack",
        f"{settings.stage}-maap-mmt",
        cpu=settings.task_cpu,
        memory=settings.task_memory,
        mincount=settings.min_ecs_instances,
        maxcount=settings.max_ecs_instances,
        permissions=[],
        env=core.Environment(
            account=os.environ.get("CDK_DEPLOY_ACCOUNT", os.environ["CDK_DEFAULT_ACCOUNT"]),
            region=os.environ.get("CDK_DEPLOY_REGION", os.environ["CDK_DEFAULT_REGION"]))
    )
else:
    raise Exception(f"Unsupported value for deployment_strategy: {settings.deployment_strategy}")

app.synth()
