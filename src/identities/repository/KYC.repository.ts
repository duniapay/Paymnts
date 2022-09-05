import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { KYCEntity } from '../entity/kyc.entity';

@Injectable()
export class KYCRepository extends Repository<KYCEntity> {
  constructor(private dataSource: DataSource) {
    super(KYCEntity, dataSource.createEntityManager());
  }
}
