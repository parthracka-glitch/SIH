"""Role-Based Access Control — FastAPI dependencies for endpoint protection."""

from typing import Callable
from fastapi import Depends

from app.core.auth.models import RoleEnum, User
from app.core.auth.dependencies import get_current_active_user
from app.core.exceptions import ForbiddenError


def require_roles(*allowed_roles: RoleEnum) -> Callable:
    """FastAPI dependency that checks if the current user has one of the allowed roles."""

    async def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role == RoleEnum.SUPERADMIN.value:
            return current_user
        if current_user.role not in [r.value for r in allowed_roles]:
            raise ForbiddenError(
                f"Role '{current_user.role}' is not authorized. Required: {[r.value for r in allowed_roles]}"
            )
        return current_user

    return role_checker
