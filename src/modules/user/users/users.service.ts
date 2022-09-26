import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { SignUpInput } from '@auth/dtos';
import { User } from './models';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: SignUpInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
