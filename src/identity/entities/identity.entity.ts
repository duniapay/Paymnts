import { KycSchema, KycStatus } from '@fiatconnect/fiatconnect-types';
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';

@Entity()
export class IdentityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'kycSchemaName',
    type: 'enum',
    enum: KycSchema,
  })
  kycSchemaName?: KycSchema;

  @Column({
    name: 'status',
    type: 'enum',
    enum: KycStatus,
  })
  status?: KycStatus;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  middleName?: string;
  @Column({ type: 'varchar', length: 255 })
  lastName: string;
  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column('simple-json')
  address: {
    address1: string;
    address2?: string;
    isoCountryCode: string;
    city: string;
    postalCode?: string;
  };
  @Column({ type: 'varchar', length: 255 })
  mobile: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;
  @Column({ type: 'varchar', length: 255 })
  selfieDocument: string;
  @Column({ type: 'varchar', length: 255 })
  identificationDocument: string;

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  updated_At: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_At: Date;
}
