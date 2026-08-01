import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Run' })
export class RunPersistence {
  @PrimaryColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  clientId: string;

  @Column()
  domain: string;

  @Column({ default: 'layer1' })
  phase: string;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
