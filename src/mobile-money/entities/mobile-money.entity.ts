import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseTransactionEntity } from '../../bank/entities/base-transaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class MobileMoneyTransactionEntity extends BaseTransactionEntity {
  @Column({ type: 'varchar' })
  operator: string;
  @Column({ type: 'varchar' })
  receiver_phone_number: string;
  @Column({ type: 'varchar', nullable: true })
  otp?: string;

  @ManyToOne(() => User, (user) => user.momo_transfers)
  owner: User;
}
