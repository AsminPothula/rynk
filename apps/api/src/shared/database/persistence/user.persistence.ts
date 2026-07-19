import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { SignUpMode, SignUpModeType } from '../../../type';
import { UserRolePersistence } from './user-role.persistence';

@Entity({
  name: 'User',
})
@Unique(['email'])
export class UserPersistence {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: false,
  })
  status: string;

  @Column({
    nullable: true,
  })
  statusChangedAt: Date;

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

  @Column({ nullable: true })
  deactivatedAt: Date;

  @OneToMany(() => UserRolePersistence, (role) => role.user, {
    eager: true,
  })
  roles: UserRolePersistence[];

  @Column({ nullable: false, default: true })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  verificationEmailLastSent: Date;

  @Column({
    nullable: false,
    type: 'enum',
    enum: SignUpMode,
    enumName: `SignUpMode`,
    default: SignUpMode.Guest,
  })
  signUpMode: SignUpModeType;

  @Column({ nullable: false, default: false })
  isGuest: boolean;
}
