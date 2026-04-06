import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import z from "zod";
import { asyncHandler } from "../utils/tryCatch";
import { AuthRequest } from "../utils/authRequest";
import { AppError } from "../utils/errorHandler";

// const user = {
//   email: z.email(),
// };

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
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
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

export const signin = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { data, error } = parseInput(req.body);
  if (error) {
    // return res.status(500).json({
    //   message: error,
    // });
    throw new AppError(error, 500);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data?.email,
    },
  });
  if (!user) {
    // return res.status(401).json({
    //   message: "please signup before trying to login",
    // });
    throw new AppError("please signup befrore trying to login", 401);
  }
  const hashedPassword = await bcrypt.compare(data!.password, user.password);
  if (!hashedPassword) {
    // return res.status(401).json({
    //   message: "enter the correct password",
    // });
    throw new AppError("enter the correct password", 401);
  }
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
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
  return res.status(200).json({
    message: accessToken,
  });
});

export const changePass = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = Number(req.userId);
    if (!userId || isNaN(userId)) {
      throw new AppError("you are not logged in", 401);
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new AppError("user does not exist", 401);
    }
    const { newPassword, currentPassword } = req.body;
    const hashedPassword = await bcrypt.compare(currentPassword, user.password);
    if (!hashedPassword) {
      throw new AppError("enter the currentPassword", 400);
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newHashedPassword,
      },
    });
    res.status(200).json({
      message: "your password is updated succesfully",
    });
    next();
  },
);

export const userExists = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      throw new AppError("enter the email", 401);
    }
    const user = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(user)) {
      throw new AppError("enter valid email", 400);
    }
    const account = await prisma.user.findUnique({
      where: { email: user },
    });
    if (!account) {
      return res.status(200).json({
        exists: false,
      });
    }
    return res.status(200).json({
      exists: true,
    });
  },
);

export const whoAmI = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = Number(req.userId);
    if (!userId) {
      throw new AppError("unauthorized", 401);
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
      },
    });
    return res.status(200).json(user);
  },
);

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new AppError("unauthorised", 401);
  }
  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });

  if (!user) {
    throw new AppError("Invalid refresh token", 401);
  }
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
  if (typeof decoded === "string" || !("userId" in decoded)) {
    throw new AppError("Invalid token", 401);
  }

  const newAccessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return res.sendStatus(200);
});
