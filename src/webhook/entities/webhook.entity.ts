import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';

@Entity('webhook')
export class WebhookEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', nullable: true })
  url: string;
  @CreateDateColumn()
  created_At: Date;
  @UpdateDateColumn()
  updated_At: Date;
}
