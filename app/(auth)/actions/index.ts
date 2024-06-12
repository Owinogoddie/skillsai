"use server"
import db from "@/lib/db";
import { LoginSchema, RegisterSchema } from "@/schemas/auth";
import { z } from "zod";
import bcrypt, { compare, compareSync } from "bcryptjs";

export const login_action = async (values: z.infer<typeof LoginSchema>) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid Fields" };
  }
  const { email, password, code } = validatedValues.data;
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!existingUser) {
    return { error: "User Does not exist" };
  }

  const match = await compareSync(password, existingUser.password as string);
  //   const passwordMatch=await compareas(password,existingUser.password)
  if (!match) {
    return { error: "Invalid credentials" };
  }
  if (match) {
    return { success: existingUser };
  }
};
export const register_action = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedValues = RegisterSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid Fields" };
  }
  const { email, password, name } = validatedValues.data;
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return { error: "User Already exists" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return { success: "Register successfully" };
};
