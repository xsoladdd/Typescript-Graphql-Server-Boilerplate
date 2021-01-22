import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 80 })
  title: string;

  @Column({ type: "varchar", length: 300 })
  content: string;

  @ManyToOne(() => User, (user) => user.tweets)
  user: User;
}
