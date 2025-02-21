import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MultiAuthGuard extends AuthGuard(['jwt', 'google']) {
  private readonly logger = new Logger(MultiAuthGuard.name);

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(`Erro de autenticação: ${info?.message || 'Usuário não encontrado'}`);
      throw err || new UnauthorizedException();
    }
    this.logger.log(`Usuário autenticado: ${JSON.stringify(user)}`);
    return user;
  }
}
