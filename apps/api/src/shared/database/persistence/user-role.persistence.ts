import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfileRole, UserProfileRoleType } from '../../../type';
import { UserPersistence } from './user.persistence';

@Entity({
  name: 'UserRole',
})
@Unique(['userId', 'role'])
export class UserRolePersistence {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  userId: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserProfileRole,
    enumName: `UserProfileRole`,
  })
  role: UserProfileRoleType;

  @ManyToOne(() => UserPersistence, {
    nullable: false,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'userId',
  })
  user: UserPersistence;

  @CreateDateColumn({
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
