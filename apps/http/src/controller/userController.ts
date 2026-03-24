import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

type userInput = {
  email: string;
  password: string;
};
function parseInput(body: any): {
  data?: userInput;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { error: "Invalid payload" };
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email) return { error: "email required" };
  if (!password) {
    return { error: "password is required" };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Invalid email format" };
  }
  if (password.length < 6) {
    return { error: "password must be greater than 6 chars" };
  }
  return {
    data: {
      email,
      password,
    },
  };
}
export const signup = async function (req: Request, res: Response) {
  try {
    const { data, error } = parseInput(req.body);
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data?.email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "user already exists ",
      });
    }
    // const hashedPassword = jwt.sign(password, process.env.JWT_SECRET!);
    const hashedPassword = await bcrypt.hash(data!.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data!.email,
        password: hashedPassword,
      },
    });
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const signin = async function (req: Request, res: Response) {
  try {
    const { data, error } = parseInput(req.body);
    if (error) {
      return res.status(500).json({
        message: error,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data?.email,
      },
    });
    if (!user) {
      return res.status(201).json({
        message: "please signup before trying to login",
      });
    }
    const hashedPassword = await bcrypt.compare(data!.password, user.password);
    if (!hashedPassword) {
      return res.status(201).json({
        message: "enter the correct password",
      });
    }
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({
      message: accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
