import { Exclude } from "class-transformer";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true })
  username: string;

  @Column({ length: 30 })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ length: 30, name: "password_salt" })
  @Exclude({ toPlainOnly: true })
  salt: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 30 })
  email: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: 1, name: "role_id" })
  roleId: number;

  @CreateDateColumn({ name: "create_time" })
  createTime: Date;

  @UpdateDateColumn({ name: "update_time" })
  updateTime: Date;
}
