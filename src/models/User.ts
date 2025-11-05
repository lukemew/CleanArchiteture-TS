import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  @Column("varchar")
  name!: string;
  @Column("varchar")
  email!: string;
  @Column("varchar")
  password!: string;
  @CreateDateColumn({ type: "time without time zone" })
  createdAt!: Date;
}
