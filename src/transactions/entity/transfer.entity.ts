import { TransferStatus, TransferType } from '@fiatconnect/fiatconnect-types';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class TransferEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fiatAccountId', type: 'varchar', length: 255 })
  fiatAccountId: string;

  @ManyToOne(() => User, (user) => user.transactions)
  partner: User;

  @Column({})
  amount: number;
  @Column({ type: 'simple-json' })
  metadata: {
    transferAddress?: string;
    quote: any;
    fee: number;
  };

  @Column({
    name: 'transferStatus',
    type: 'enum',
    enum: TransferStatus,
  })
  status?: TransferStatus;

  @Column({
    name: 'transferType',
    type: 'enum',
    enum: TransferType,
  })
  transferType?: TransferType;
}
