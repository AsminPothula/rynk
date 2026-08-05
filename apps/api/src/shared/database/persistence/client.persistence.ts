import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Client' })
export class ClientPersistence {
  @PrimaryColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  domain: string;

  @Column()
  name: string;

  @Index()
  @Column('uuid')
  ownerId: string;

  @Column({ default: 'Onboarding' })
  status: string;

  /** Entitlement/access status (active | trialing | comp | none). */
  @Column({ default: 'none' })
  accessStatus: string;

  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
