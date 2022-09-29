import { ValidateIf } from 'class-validator';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  amount: number;
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
  @Column({ type: 'varchar' })
  sending_reason: string;
  @Column({ type: 'varchar', nullable: true })
  failure_reason?: string;
  @Column({ type: 'varchar', nullable: true })
  status?: string;
  @Column({ type: 'varchar' })
  country: string;
  @Column({ type: 'varchar' })
  city: string;
  @Column({ type: 'varchar' })
  reference: string;
  @Column({ type: 'varchar' })
  receiver_first_name: string;
  @Column({ type: 'varchar' })
  receiver_last_name: string;
  @Column({ type: 'varchar' })
  partner_id: string;
  @Column({ type: 'varchar' })
  currency: string;
}
