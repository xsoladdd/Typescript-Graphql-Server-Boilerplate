import { hash, checkHash, sign, verify, isExpired } from "../../utils";
import {
  Resolver,
  Mutation,
  Query,
  InputType,
  Field,
  Int,
  Arg,
  ObjectType,
  Authorized,
} from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import { EncryptedID } from "../scalars/";
import { tokenObject } from "../../types";

@InputType()
class IUser implements Partial<User> {
  @Field()
  firstName!: string;
  @Field()
  lastName!: string;
  @Field()
  email!: string;
  @Field(() => Int)
  age: number;
  @Field()
  password: string;
}
@InputType()
class IEncryptedID {
  @Field(() => EncryptedID)
  id!: string;
}

@InputType()
class ILogin {
  @Field(() => String)
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
class RLogin {
  @Field()
  message: string;
  @Field({ nullable: true })
  token?: string;
  @Field()
  status: number;
}

@ObjectType()
class RUsers {
  @Field()
  message: string;
  @Field(() => [User])
  users: User[];
  @Field()
  status: number;
}

@ObjectType()
class RUser {
  @Field()
  message: string;
  @Field(() => User, { nullable: true })
  user: User | null;
  @Field()
  status: number;
}

@Resolver()
export class UserResolver {
  @Mutation(() => RUser)
  async newUser(
    @Arg("input", { nullable: false }) input: IUser
  ): Promise<RUser> {
    const { age, firstName, lastName, email, password } = input;
    const userRepository = getRepository(User);
    const hashedPassword: string = await hash(password);
    const user: User = userRepository.create({
      age,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await userRepository.save(user).catch((err) => {
      return {
        message: err.message,
        user: null,
        status: 0,
      };
    });
    return {
      message: "Succesfully inserted",
      user: user,
      status: 1,
    };
  }

  @Mutation(() => RLogin)
  async login(
    @Arg("input", { nullable: false }) input: ILogin
  ): Promise<RLogin> {
    const userRepository = getRepository(User);
    const { email, password } = input;
    const user = (await userRepository.findOne({ email })) as User;
    if (!user) {
      return {
        message: "Invalid username",
        status: 0,
      };
    }
    const isAuthenticated = await checkHash(password, user.password);
    if (!isAuthenticated) {
      return {
        message: "Incorrect ppassword",
        status: 0,
      };
    }
    const token = sign(user);
    return {
      message: "Login Success",
      status: 1,
      token: token,
    };
  }

  @Query(() => Boolean)
  meow(@Arg("token", { nullable: false }) token: string): boolean {
    const tokenData: tokenObject = verify(token);
    console.log(tokenData);
    return isExpired(tokenData.exp);
  }
  //  @RUsers here is the type def
  @Query(() => RUsers) // This RUsers is use as typedefs for return
  @Authorized()
  // Typescript structure check for return of this function
  async getUsers(): Promise<RUsers> {
    const userRepository = getRepository(User);
    const users: User[] = await userRepository.find();
    return {
      message: "hello world",
      users: users,
      status: 1,
    };
  }
  @Query(() => RUser)
  async getUser(
    @Arg("input", { nullable: false }) input: IEncryptedID
  ): Promise<RUser> {
    const userRepository = getRepository(User);
    const user: User = (await userRepository.findOne({
      id: input.id,
    })) as User;
    if (!user)
      return {
        message: "no user found",
        user: null,
        status: 0,
      };

    return {
      message: "hello world",
      user: user,
      status: 1,
    };
  }
}
