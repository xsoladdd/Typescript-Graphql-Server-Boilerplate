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
  Args,
} from "type-graphql";
import { getRepository, Raw } from "typeorm";
import { User } from "../../entity/User";
import { EncryptedID } from "../scalars/";
// import { tokenObject } from "../../types";
import { Profile } from "../../entity/Profile";
// import { isNullableType } from "graphql";

@InputType()
class InputRegistration implements Partial<User & Profile> {
  // User Side
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  mobileNumber: string;
  @Field()
  password: string;

  // Profile side
  @Field()
  firstName: string;
  @Field({ nullable: true })
  middleName: string;
  @Field()
  lastName: string;
  @Field()
  birthday: Date;
  @Field()
  nickname: string;
  @Field({ nullable: true })
  displayImage: string;
}

@InputType()
class InputLogin {
  @Field()
  usernameOrEmail: string;
  @Field()
  password: string;
}

@ObjectType()
class ReturnStructure {
  @Field(() => String)
  message: string;
  @Field(() => Int)
  status: number;
}

@ObjectType()
class ReturnRegister extends ReturnStructure {
  @Field(() => User)
  user?: User | null;
  @Field(() => Profile)
  profile?: Profile | null;
}
@ObjectType()
class ReturnLogin extends ReturnStructure {
  @Field(() => String, { nullable: true })
  token?: string | null;
  @Field(() => Profile)
  profile?: Profile | null;
}

@Resolver()
export class UserResolver {
  // Registration
  @Mutation(() => ReturnRegister)
  async registerUser(
    @Arg("input", { nullable: false }) input: InputRegistration
  ): Promise<ReturnRegister> {
    const {
      birthday,
      displayImage,
      email,
      firstName,
      lastName,
      middleName,
      mobileNumber,
      nickname,
      password,
      username,
    } = input;
    const userRepo = getRepository(User);
    const profileRepo = getRepository(Profile);
    const profile = profileRepo.create({
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      birthday,
      nickname,
      display_image: displayImage,
    });
    await profileRepo.save(profile).catch((err) => {
      return {
        message: err.message,
        status: 0,
      };
    });
    const user: User = userRepo.create({
      email,
      password: await hash(password),
      username,
      mobile_number: mobileNumber,
      profile,
    });
    await userRepo.save(user).catch((err) => {
      return {
        message: err.message,
        status: 0,
      };
    });
    return {
      message: "Succesfully",
      status: 1,
      user,
      profile,
    };
  }

  @Query(() => ReturnLogin)
  async login(
    @Arg("input", { nullable: false }) input: InputLogin
  ): Promise<ReturnLogin> {
    const { password, usernameOrEmail } = input;
    const userRepo = getRepository(User);
    let user = await userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect(`user.profile`, `profile`)
      .where("user.username = :username", { username: usernameOrEmail })
      .getOne();
    if (!user) {
      user = await userRepo
        .createQueryBuilder("user")
        .leftJoinAndSelect(`user.profile`, `profile`)
        .where("user.email = :email", { email: usernameOrEmail })
        .getOne();
    }
    if (!user) {
      return {
        message: "Username/Email doesn't exist",
        status: 0,
      };
    }
    if (!(await checkHash(password, user.password))) {
      return {
        message: "Invalid password",
        status: 1,
      };
    }

    // Create Token
    const token = sign(user);
    console.log(user.profile);
    return {
      message: "Succesfully",
      status: 1,
      token,
      profile: user.profile,
    };
  }

  @Query(() => String)
  async ping(): Promise<String> {
    return "Ping successfull. hey thanks for the ping";
  }

  // @Mutation(() => RUser)
  // async newUser(
  //   @Arg("input", { nullable: false }) input: IUser
  // ): Promise<RUser> {
  //   const { age, firstName, lastName, email, password } = input;
  //   const userRepository = getRepository(User);
  //   const hashedPassword: string = await hash(password);
  //   const user: User = userRepository.create({
  //     email,
  //     password: hashedPassword,
  //   });
  //   await userRepository.save(user).catch((err) => {
  //     return {
  //       message: err.message,
  //       user: null,
  //       status: 0,
  //     };
  //   });
  //   return {
  //     message: "Succesfully inserted",
  //     user: user,
  //     status: 1,
  //   };
  // }
}
