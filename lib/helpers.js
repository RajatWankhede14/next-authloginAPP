import { signIn } from "next-auth/react";

export const loginUser = async (phoneNumber, password) => {
  let loginRes = await signIn("credentials", {
    redirect: false,
    phoneNumber,
    password,
  });

  return loginRes;
};
