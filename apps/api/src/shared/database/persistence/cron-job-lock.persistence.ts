import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({
  name: 'CronJobLock',
})
@Unique(['key'])
export class CronJobLockPersistence {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  key: string;

  @Column({ nullable: false })
  locked: boolean;
}
