import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { Banks, BankTransferDTO } from './dto/create-bank.dto';
import { UpdateBankTransferDto } from './dto/update-bank.dto';
import { BankTransactionEntity } from './entities/bank.entity';
import { GTBankService } from './providers/gtbank.service';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(BankTransactionEntity)
    private repository: Repository<BankTransactionEntity>,
    private readonly psp: GTBankService,
    @InjectQueue('bank-payments-queue') private queue: Queue,
  ) {}

  findAll(): Promise<BankTransactionEntity[]> {
    return this.repository.find();
  }
  async create(transaction: BankTransferDTO): Promise<BankTransactionEntity> {
    await this.queue.add('transfer', transaction);
    return this.repository.save(transaction);
  }

  findOne(id: string): Promise<BankTransactionEntity> {
    return this.repository.findOneBy({ id });
  }

  public async update(id: string, updateBankDto: UpdateBankTransferDto): Promise<any> {
    const item = await this.repository.findOneBy({ id });
    // TODO: CREATE Entity
    this.logger.log(`update ${updateBankDto}`);
    const updateResult = await this.repository.update({ id }, item);
    await this.queue.add('notify', updateResult);
  }

  private async balance(): Promise<number> {
    return this.psp.balance();
  }
  private async getBanks(): Promise<Banks[]> {
    return this.psp.getBanks();
  }
}
