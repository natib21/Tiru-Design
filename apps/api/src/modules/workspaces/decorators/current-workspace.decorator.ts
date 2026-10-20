import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentWorkspacePayload {
  workspaceId: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export const CurrentWorkspace = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentWorkspacePayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.workspace;
  }
);
