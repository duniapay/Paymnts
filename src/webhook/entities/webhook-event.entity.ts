import { WebhookEventType, KycSchema } from '@fiatconnect/fiatconnect-types';
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, Unique } from 'typeorm';

@Entity('webhookEvents')
@Unique(['eventId'])
export class WebhookEventEntity {
  @PrimaryGeneratedColumn('uuid')
  eventId: string;

  @Column({
    name: 'eventType',
    type: 'enum',
    enum: WebhookEventType,
  })
  eventType?: WebhookEventType;

  @Column({ type: 'varchar', nullable: false })
  provider: string;

  @Column('simple-json')
  payload: any;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @UpdateDateColumn()
  updated_At: Date;
}
