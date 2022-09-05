import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AccountEntity } from '../../accounts/entity/account.entity';
import { TransferEntity } from '../../transactions/entity/transfer.entity';
import { Role } from '../enums/role.enum';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.standard,
  })
  roles: Role[];

  // currenciesAccount
  // fiatAccounts

  @OneToMany(() => AccountEntity, (photo) => photo.partner) // note: we will create author property in the Photo class below
  accounts: AccountEntity[];

  // transactions
  @OneToMany(() => TransferEntity, (photo) => photo.partner) // note: we will create author property in the Photo class below
  transactions: TransferEntity[];
}
