import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoggerService } from '../logger/logger.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { KYCEntity } from './entity/kyc.entity';
import { KYCRepository } from './repository/KYC.repository';

@Injectable()
export class KycService {
  constructor(private repository: KYCRepository, private readonly logger: LoggerService = new Logger(KycService.name)) {}

  async create(createKycDto: CreateKycDto): Promise<KYCEntity> {
    const entity = new KYCEntity();
    entity.address = createKycDto.address;
    entity.dateOfBirth = createKycDto.dateOfBirth;
    entity.kycSchemaName = createKycDto.kycSchemaName;
    entity.lastName = createKycDto.lastName;
    entity.firstName = createKycDto.firstName;
    entity.phoneNumber = createKycDto.phoneNumber;
    entity.email = createKycDto.email;
    entity.selfieDocument = createKycDto.selfieDocument;
    entity.identificationDocument = createKycDto.identificationDocument;
    return this.repository.save(entity);
  }

  async findAll(): Promise<KYCEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<KYCEntity> {
    const response = this.repository.findOneBy({ id });
    return response;
  }

  async update(id: number, updateKycDto: UpdateKycDto): Promise<boolean> {
    const entity = new KYCEntity();
    entity.address = updateKycDto.address;
    entity.dateOfBirth = updateKycDto.dateOfBirth;
    entity.kycSchemaName = updateKycDto.kycSchemaName;
    entity.lastName = updateKycDto.lastName;
    entity.firstName = updateKycDto.firstName;
    entity.phoneNumber = updateKycDto.phoneNumber;
    entity.email = updateKycDto.email;
    entity.selfieDocument = updateKycDto.selfieDocument;
    entity.identificationDocument = updateKycDto.identificationDocument;
    await this.repository.update(
      {
        id,
      },
      entity,
    );
    return true;
  }

  async remove(id: number): Promise<KYCEntity> {
    const entity = await this.repository.findOneBy({ id });
    return this.repository.remove(entity);
  }
}
