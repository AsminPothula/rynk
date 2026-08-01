import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { SystemVariableType } from '../../../system-variable/system-variable.types';

@Entity({
  name: 'SystemVariable',
})
@Unique(['id', 'name'])
export class SystemVariablePersistence {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: SystemVariableType,
    enumName: `SystemVariableType`,
  })
  name: SystemVariableType;

  @Column({ nullable: false })
  value: string;
}
