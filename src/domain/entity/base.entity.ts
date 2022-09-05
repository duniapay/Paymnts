import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'created_at' })
  created_at: Date;
  @Column({ name: 'updated_at' })
  updated_at: Date;
}
