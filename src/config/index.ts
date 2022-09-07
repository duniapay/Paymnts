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
    host: process.env.CLOUDKARAFKA_BROKERS.replace(/\\n/gm, '\n'),
    authMechanism: process.env.CLOUDKARAFKA_AUTH_MECHANISM.replace(/\\n/gm, '\n'),
    topicPrefix: process.env.CLOUDKARAFKA_TOPIC_PREFIX.replace(/\\n/gm, '\n'),
    username: process.env.CLOUDKARAFKA_USERNAME.replace(/\\n/gm, '\n'),
    password: process.env.CLOUDKARAFKA_PASSWORD.replace(/\\n/gm, '\n'),
  },
  database: dbConfig(),
});
