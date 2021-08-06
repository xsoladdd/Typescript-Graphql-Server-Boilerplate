import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { EncryptedID } from "../graphql/scalars";
import { User } from "./User";

@Entity()
@ObjectType()
export class Profile {
  @Field(() => EncryptedID)
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Field(() => String)
  @Column({})
  first_name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  middle_name?: string;

  @Field(() => String)
  @Column()
  last_name: string;

  @Field(() => Date)
  @Column()
  birthday: Date;

  @Field(() => String)
  @Column()
  nickname: string;

  // Only URL. will save to cloud storage if needed
  @Field(() => String)
  @Column("text")
  display_image!: string;

  @OneToOne(() => User, (user) => user.profile) // specify inverse side as a second parameter
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  UpdatedAt!: Date;
}
