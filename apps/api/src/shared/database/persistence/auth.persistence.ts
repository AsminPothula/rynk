import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { UserPersistence } from './user.persistence';

@Entity({
  name: 'Auth',
})
@Unique(['id'])
export class AuthPersistence {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserPersistence, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'userId',
  })
  user: UserPersistence;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({ nullable: true })
  passwordChangedAt: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  oldPasswords: string;

  @Column({ nullable: true })
  deactivatedAt: Date;

  @Column({ nullable: true })
  passwordToken: string;

  @Column({ nullable: true })
  passwordTokenIssuedAt: Date;
}
