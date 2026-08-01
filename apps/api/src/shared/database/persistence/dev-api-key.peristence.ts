import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DevApiKeyPermissions, DevApiKeyPermissionsType } from '../../../type';

@Entity({
  name: 'DevApiKey',
})
@Index(['assignedTo'])
@Unique(['hmacId'])
export class DevApiKeyPersistence {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  hashedApiKey: string;

  @Column({
    nullable: false,
  })
  hmacId: string;

  @Column({
    nullable: false,
  })
  assignedTo: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: DevApiKeyPermissions,
    array: true,
    enumName: 'DevApiKeyPermissions',
  })
  permissions: DevApiKeyPermissionsType[];

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

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
