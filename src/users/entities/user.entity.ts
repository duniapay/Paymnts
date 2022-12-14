import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BankTransactionEntity } from '../../bank/entities/bank.entity';
import { MobileMoneyTransactionEntity } from '../../mobile-money/entities/mobile-money.entity';
import { WebhookEntity } from '../../webhook/entities/webhook.entity';
import { Role } from '../enums/role.enum';

@Entity()
@Unique(['email', 'mobile', 'business_name'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  firstname: string;

  @Column({ type: 'varchar', length: 255 })
  lastname: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  mobile: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: false })
  business_name: string;

  @Column({ nullable: false })
  country: string;

  @Column()
  balance: number;

  @Column({ type: 'varchar', length: 255 })
  currency: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.partner,
  })
  roles: Role[];

  @OneToOne(() => WebhookEntity)
  @JoinColumn()
  webhook_url: WebhookEntity;

  @OneToMany(() => MobileMoneyTransactionEntity, (tx) => tx.owner) // note: we will create author property in the Photo class below
  momo_transfers: MobileMoneyTransactionEntity[];

  // transactions
  @OneToMany(() => BankTransactionEntity, (tx) => tx.owner) // note: we will create author property in the Photo class below
  bank_transfers: BankTransactionEntity[];
}
