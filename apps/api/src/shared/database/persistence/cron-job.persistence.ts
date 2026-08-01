import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'CronJob',
})
export class CronJobPersistence {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  key: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  executor: string;

  @Column({ nullable: false })
  startedAt: Date;

  @Column({ nullable: false })
  completedAt: Date;
}
