import { contextObject } from "../types";
import { AuthChecker } from "type-graphql";
import { ApolloError } from "apollo-server-express";
import { tokenObject } from "../types";
import { verify, isExpired } from "../utils";

const authChecker: AuthChecker = ({ context }): boolean => {
  const { token } = context as contextObject;
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  // Retreive Token
  const tokenValue = token.split(" ")[1];
  if (!tokenValue) {
    throw new ApolloError(
      "Invalid authorization header, Format must be Bearer <jwt>",
      "BAD TOKEN"
    );
  }
  // Validate token
  // Decrypt token
  const tokenData: tokenObject = verify(tokenValue);
  return isExpired(tokenData.exp);
};

export default authChecker;
