import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { EncryptedID } from "../graphql/scalars";
import { Profile } from "./Profile";

@Entity()
@ObjectType()
export class User {
  @Field(() => EncryptedID)
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  username: string;

  @Field(() => String)
  @Column()
  mobile_number: string;

  @Column({ length: "255" })
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  UpdatedAt!: Date;
}
