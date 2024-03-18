import { TagEntity } from 'src/tags/tag.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: '123',
  database: 'mediumclone',
  // entities: [__dirname + './**/*.entity{.ts, .js}'],
  entities: [TagEntity],
  synchronize: true,
};

export default config;
