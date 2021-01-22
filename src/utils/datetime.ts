import moment from "moment";

export const isExpired = (time: number): boolean => {
  const timeNow = moment().unix();
  if (timeNow < time) return true;
  return false;
};
