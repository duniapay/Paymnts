import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TransferEntity } from '../entity/transfer.entity';

@Injectable()
export class TransferRepository extends Repository<TransferEntity> {
  constructor(private dataSource: DataSource) {
    super(TransferEntity, dataSource.createEntityManager());
  }
}
