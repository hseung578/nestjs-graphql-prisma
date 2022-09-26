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
    this.$on('query', (e) => this.logger.debug(`${e.query} ${e.params}`));
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
