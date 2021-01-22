import bcrypt from "bcrypt";

const saltRounds = 10;

export const hash = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const checkHash = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
