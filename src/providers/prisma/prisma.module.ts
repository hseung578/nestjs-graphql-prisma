import { Module } from '@nestjs/common';
import { PrismaConfigModule } from '@config/prisma';
import { PrismaService } from './prisma.service';

@Module({
  imports: [PrismaConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
