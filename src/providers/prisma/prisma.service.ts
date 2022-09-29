import { PrismaConfigService } from '@config/prisma';
import {
  ForbiddenException,
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);
  constructor(private readonly prismaConfig: PrismaConfigService) {
    super({
      datasources: {
        db: {
          url: prismaConfig.url,
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
    this.logger.log(`Prisma v${Prisma.prismaVersion.client}`);
    this.$on('query', (e: Prisma.QueryEvent): void =>
      this.logger.debug(`${e.query} ${e.params}`),
    );
    this.$use(
      async (
        params: Prisma.MiddlewareParams,
        next: (params: Prisma.MiddlewareParams) => Promise<Prisma.Middleware>,
      ): Promise<Prisma.Middleware> => {
        if (params.model == 'Comment') {
          if (params.action == 'delete') {
            params.action = 'update';
            params.args['data'] = { deletedAt: new Date() };
          }
          if (params.action == 'deleteMany') {
            params.action = 'updateMany';
            if (params.args.data != undefined) {
              params.args.data['deletedAt'] = new Date();
            } else {
              params.args['data'] = { deletedAt: new Date() };
            }
          }
        }
        return next(params);
      },
    );
  }
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async isMine(
    model: Prisma.ModelName,
    id: number,
    authorId: number,
  ): Promise<void> {
    const data = await this.$queryRaw<any[]>`SELECT * FROM ${Prisma.raw(
      model,
    )} WHERE id = ${id} AND authorId = ${authorId};`;

    if (data.length === 0) throw new ForbiddenException();
  }
}
