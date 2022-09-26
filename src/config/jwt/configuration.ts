import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessKey: process.env.ACCESS_KEY,
  accessExpire: process.env.ACCESS_EXPIRE,
  refreshKey: process.env.REFRESH_KEY,
  refreshExpire: process.env.REFRESH_EXPIRE,
}));
