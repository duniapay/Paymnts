import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { dbConfig } from './database';

interface iConfig {
  port: number;
  database: PostgresConnectionOptions;
  brokers: {
    host: string;
    authMechanism: string;
    topicPrefix: string;
    username: string;
    password: string;
  };
}

export default (): Partial<iConfig> => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  brokers: {
    host: process.env.CLOUDKARAFKA_BROKERS,
    authMechanism: process.env.CLOUDKARAFKA_AUTH_MECHANISM,
    topicPrefix: process.env.CLOUDKARAFKA_TOPIC_PREFIX,
    username: process.env.CLOUDKARAFKA_USERNAME,
    password: process.env.CLOUDKARAFKA_PASSWORD,
  },
  database: dbConfig(),
});
