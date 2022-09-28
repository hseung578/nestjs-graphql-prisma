import { PrismaConfigService } from '@config/prisma';
import {
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
    this.$on('query', (e: Prisma.QueryEvent) =>
      this.logger.debug(`${e.query} ${e.params}`),
    );
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
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
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
