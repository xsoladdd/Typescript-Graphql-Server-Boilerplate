import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Tweet } from "./Tweet";
import { EncryptedID } from "../graphql/scalars";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => EncryptedID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => Int)
  @Column()
  age: number;

  @Column({ length: "255" })
  password: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  UpdatedAt!: Date;

  @OneToMany(() => Tweet, (tweet) => tweet.user)
  tweets: Tweet[];
}
