"""MMT_STACK Configs."""

from enum import Enum
from typing import Optional

import pydantic

class DeploymentStrategyEnum(str, Enum):
    application = 'application'
    pipeline = 'pipeline'

class StackSettings(pydantic.BaseSettings):
    """Application settings"""

    name: str = "maap-mmt"
    stage: str = "production"

    owner: Optional[str]
    client: Optional[str]

    # AWS ECS settings
    min_ecs_instances: int = 2
    max_ecs_instances: int = 10
    task_cpu: int = 1024
    task_memory: int = 2048

    # Needed for CodePipeline
    codestar_connection_arn: Optional[str]

    # Necessary for HTTPS load balancer
    certificate_arn: str

    permissions_boundary_name: Optional[str]
    vpc_id: Optional[str]

    deployment_strategy: DeploymentStrategyEnum

    class Config:
        """model config"""

        env_file = ".env"
        env_prefix = "MMT_STACK_"
