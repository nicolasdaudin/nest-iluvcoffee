import { registerAs } from '@nestjs/config';

export default registerAs('coffees', () => ({
  databaseHost: 'postgres from coffees.config.ts',
}));
