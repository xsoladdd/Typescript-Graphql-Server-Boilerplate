import { UserResolver } from "./resolvers/User";
import { buildSchema } from "type-graphql";
import authChecker from "./authChecker";

// import { EncryptedID } from "../scalars";

export default buildSchema({
  resolvers: [UserResolver],
  authChecker,
  // scalarsMap: [{ type: () => ID, scalar: EncryptedID }],
});
