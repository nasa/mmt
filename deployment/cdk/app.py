"""Construct App."""

import os
from os import path
from typing import Any, Dict, List, Optional, Union

from config import StackSettings

from aws_cdk import (
    core,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_rds as rds,
    aws_route53,
    aws_ecs_patterns as ecs_patterns,
    aws_ecr_assets as ecr_assets,
    aws_iam as iam,
    aws_elasticloadbalancingv2 as elb,
    aws_secretsmanager as secretsmanager,
    aws_ssm as ssm
)

settings = StackSettings()


class mmtStack(core.Stack):
    """MMT ECS Fargate Stack."""

    def __init__(
        self,
        scope: core.Construct,
        id: str,
        cpu: Union[int, float] = 512,
        memory: Union[int, float] = 1024,
        mincount: int = 1,
        maxcount: int = 50,
        permissions: Optional[List[iam.PolicyStatement]] = None,
        env: Optional[Dict] = None,
        **kwargs: Any,
    ) -> None:
        """Define stack."""
        super().__init__(scope, id, env=core.Environment(
            account=os.environ.get("CDK_DEPLOY_ACCOUNT",
                                   os.environ["CDK_DEFAULT_ACCOUNT"]),
            region=os.environ.get("CDK_DEPLOY_REGION", os.environ["CDK_DEFAULT_REGION"])), *kwargs)

        permissions = permissions or []
        env = env or {}

        vpc = ec2.Vpc(self, f"{id}-vpc", max_azs=2)

        db_credentials_secret = rds.DatabaseSecret(
            self, 'phil-DBSecret', username="postgres")

        core.CfnOutput(self, "dbSecretName",
                       value=db_credentials_secret.secret_name)
        core.CfnOutput(self, 'dbSecretARN',
                       value=db_credentials_secret.secret_arn)

        ingress_sg = ec2.SecurityGroup(self, f"{id}-rds-ingress",
                                       vpc=vpc,
                                       security_group_name=f"{id}-rds-ingress-sg",
                                       )

        ingress_sg.add_ingress_rule(
            # vpcCidrBlock refers to all the IP addresses in vpc
            ec2.Peer.ipv4(vpc.vpc_cidr_block),
            ec2.Port.tcp(5432),
            'Allows only local resources inside VPC to access this Postgres port (default -- 3306)'
        )

        db = rds.DatabaseInstance(
            self, "RDS",
            database_name="rdsdb",
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE),
            security_groups=[ingress_sg],
            engine=rds.DatabaseInstanceEngine.postgres(
                version=rds.PostgresEngineVersion.VER_10_15),
            credentials=rds.Credentials.from_secret(db_credentials_secret),
            port=5432,
            instance_type=ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE2,
                ec2.InstanceSize.MEDIUM,
            ),
            removal_policy=core.RemovalPolicy.DESTROY,
            deletion_protection=False,  # TODO
            publicly_accessible=True  # TODO
        )

        core.CfnOutput(self, 'dbArn', value=db.instance_arn)
        core.CfnOutput(self, 'dbEndpointAddress',
                       value=db.db_instance_endpoint_address)
        core.CfnOutput(self, 'dbEndpointPort',
                       value=db.db_instance_endpoint_port)

        cluster = ecs.Cluster(
            self, f"{id}-cluster", vpc=vpc, enable_fargate_capacity_providers=True)

        core.CfnOutput(self, 'clusterArn', value=cluster.cluster_arn)

        task_env = env.copy()
        task_env.update(dict(LOG_LEVEL="error"))
        task_env["ENV"] = "production"
        task_env["RAILS_ENV"] = "production"
        task_env["RAILS_SERVE_STATIC_FILES"] = "true" # to serve css, etc., assets
        task_env["DATABASE_HOST"] = db.db_instance_endpoint_address

        # TODO: do these need to change?
        task_env["SECRET_KEY_BASE"] = "foobar"
        task_env["EARTHDATA_USERNAME"] = "devseed"

        task_env["CMR_ROOT"] = ssm.StringParameter.value_for_string_parameter(
            self, f"/maap/cmr-root/{settings.stage}")
        task_env["MMT_ROOT"] = ssm.StringParameter.value_for_string_parameter(
            self, f"/maap/mmt-root/{settings.stage}")
        task_env["CUMULUS_REST_API"] = ssm.StringParameter.value_for_string_parameter(
            self, f"/maap/cumulus-rest-api/{settings.stage}")

        secret_earthdata_password = secretsmanager.Secret.from_secret_name_v2(
            self, f"{id}-earthdata-password", f"maap-earthdata-password-{settings.stage}")
        secret_cmr_urs_password = secretsmanager.Secret.from_secret_name_v2(
            self, f"{id}-cmr-urs-password", f"maap-cmr-urs-password-{settings.stage}")

        task_definition = ecs.FargateTaskDefinition(self, f"{id}-task-definition",
                                                    cpu=cpu, memory_limit_mib=memory)

        task_definition.add_container(
            f"{id}-container",
            image=ecs.ContainerImage.from_docker_image_asset(
                ecr_assets.DockerImageAsset(
                    self,
                    f"{id}-image",
                    directory=path.abspath("../"),
                    file="deployment/Dockerfile"
                )
            ),
            port_mappings=[ecs.PortMapping(
                container_port=3000, host_port=3000)],
            secrets={
                "DATABASE_PASSWORD": ecs.Secret.from_secrets_manager(db_credentials_secret, "password"),
                "EARTHDATA_PASSWORD": ecs.Secret.from_secrets_manager(secret_earthdata_password),
                "CMR_URS_PASSWORD": ecs.Secret.from_secrets_manager(secret_cmr_urs_password)
            },
            environment=task_env,
            logging=ecs.LogDrivers.aws_logs(stream_prefix=id)
        )

        fargate_service = ecs_patterns.ApplicationLoadBalancedFargateService(
            self,
            f"{id}-service",
            cluster=cluster,
            desired_count=mincount,
            public_load_balancer=True,
            protocol=elb.ApplicationProtocol.HTTPS,
            domain_name=f"{settings.name}.{settings.stage}.maap-project.org",
            domain_zone=aws_route53.HostedZone.from_lookup(self, f"{id}-hosted-zone",
                                                           domain_name="maap-project.org"),
            redirect_http=True,
            task_definition=task_definition
        )
        fargate_service.target_group.configure_health_check(path="/")

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

        # api_param = ssm.StringParameter(self, "StringParameter",
        #                                 description="pygeoapi api gateway url",
        #                                 parameter_name=f"/{stack_name}/pygeoapi/url",
        #                                 string_value=api.url,
        #                                 )

        # core.CfnOutput(self, "Endpoint", value=api.url)
        # core.CfnOutput(self, "Endpoint SSM Parameter", value=api_param.parameter_name)


app = core.App()

perms = []

# Tag infrastructure
for key, value in {
    "Project": settings.name,
    "Stack": settings.stage,
    "Owner": settings.owner,
    "Client": settings.client,
}.items():
    if value:
        core.Tag.add(app, key, value)

ecs_stackname = f"{settings.name}-ecs-{settings.stage}"

mmtStack(
    app,
    ecs_stackname,
    cpu=settings.task_cpu,
    memory=settings.task_memory,
    mincount=settings.min_ecs_instances,
    maxcount=settings.max_ecs_instances,
    permissions=perms,
    env=settings.env,
)

app.synth()
