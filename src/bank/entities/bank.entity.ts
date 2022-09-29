import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseTransactionEntity } from './base-transaction.entity';

@Entity()
export class BankTransactionEntity extends BaseTransactionEntity {
  @Column({ type: 'varchar' })
  receiver_phone_number: string;
  @Column({ type: 'varchar' })
  receiver_bank_code: string;
  @Column({ type: 'varchar' })
  receiver_bank_name: string;
  @Column({ type: 'varchar' })
  receiver_bank_account: string;
  @Column({ type: 'varchar' })
  receiver_first_name: string;
  @Column({ type: 'varchar' })
  receiver_last_name: string;

  @ManyToOne(() => User, (user) => user.bank_transfers)
  owner: User;
}
