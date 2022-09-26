import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/user/users/users.module';
import { JwtConfigModule } from '@config/jwt';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtAccessStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({}), UsersModule, JwtConfigModule],
  providers: [AuthResolver, AuthService, JwtAccessStrategy],
})
export class AuthModule {}
