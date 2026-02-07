import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "./public";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}

// O Auth guard seria como um middleware que automatiza o processo de verificação de acesso de uma rota. O ExecutionContext, ele é o contexto da requisição http, que acessa dados. Já o reflector, é um leito de metadata do nest. Quando é adicionado @Public no controller, o nest por meio do guard, com o reflect utiliza o método getAllAndOverride, para buscar metadados dentro ou do handler ou da classe do controller que tem o valor de IS_PUBLIC_KEY. Se ele conseguir ler, ele retorna true, então ele permite passar sem validar o jwt. Se não encontrar, o AuthGuard tem o seu próprio canActive, e ele é chamado pelo super e é passado o contexto da requisição, onde é visto se tem o token, se ele é válido. Ele verifica se tem o token, e chama o método validate da strategy.
