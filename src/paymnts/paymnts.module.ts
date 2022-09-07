import { Module } from '@nestjs/common';
import { PaymntsService } from './paymnts.service';
import { PaymntsController } from './paymnts.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [PaymntsController],
  providers: [PaymntsService]
})
export class PaymntsModule {}
