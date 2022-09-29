import { KycStatus } from '@fiatconnect/fiatconnect-types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { IdentityEntity } from './entities/identity.entity';

@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(IdentityEntity)
    private repository: Repository<IdentityEntity>,
  ) {}
  create(createIdentityDto: CreateIdentityDto) {
    const formattedDOB = new Date(createIdentityDto.dateOfBirth);
    const entity = new IdentityEntity();
    entity.kycSchemaName = createIdentityDto.kycSchemaName;
    entity.address = createIdentityDto.address;
    entity.firstName = createIdentityDto.firstName;
    entity.lastName = createIdentityDto.lastName;
    entity.email = createIdentityDto.email;
    entity.mobile = createIdentityDto.phoneNumber;
    entity.identificationDocument = createIdentityDto.identificationDocument;
    entity.selfieDocument = createIdentityDto.selfieDocument;
    entity.dateOfBirth = formattedDOB;
    entity.middleName = createIdentityDto.middleName;
    entity.expires_At = new Date(new Date().getMonth() + 3);

    if (new Date().getFullYear() - formattedDOB.getFullYear() >= 20) {
      entity.status = KycStatus.KycPending;
    } else {
      entity.status = KycStatus.KycDenied;
    }
    return this.repository.save(entity);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const unprocessedFiles = await this.repository.find({ where: { status: KycStatus.KycPending } });
    // Extracts Data from Selfie document
    // Extracts Text from Identification Document
    // Expire Identity Document
  }

  findAll(): Promise<IdentityEntity[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<IdentityEntity> {
    return this.repository.findOneBy({ id });
  }

  update(id: string, updateIdentityDto: UpdateIdentityDto) {
    const entity = new IdentityEntity();
    entity.kycSchemaName = updateIdentityDto.kycSchemaName;
    entity.address = updateIdentityDto.address;
    entity.firstName = updateIdentityDto.firstName;
    entity.lastName = updateIdentityDto.lastName;
    entity.email = updateIdentityDto.email;
    entity.mobile = updateIdentityDto.phoneNumber;
    entity.identificationDocument = updateIdentityDto.identificationDocument;
    entity.selfieDocument = updateIdentityDto.selfieDocument;
    entity.dateOfBirth = new Date(updateIdentityDto.dateOfBirth);
    entity.middleName = updateIdentityDto.middleName;
    entity.status = KycStatus.KycPending;
    return this.repository.update({ id }, entity);
  }

  async remove(id: string) {
    const entity = await this.repository.findOneBy({ id });
    return this.repository.remove(entity);
  }
}
