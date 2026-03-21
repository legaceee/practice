import prisma from "@repo/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const signup = async function (req: any, res: any) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(201).json({
        message: "email is required",
      });
    }
    if (!password) {
      return res.status(201).json({
        message: "password is required",
      });
    }
    // const hashedPassword = jwt.sign(password, process.env.JWT_SECRET!);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      message: "signup succesfull",
    });
  } catch (err) {
    console.error(err);
    return res.status(201).json({
      message: "something went wrong",
    });
  }
};

export const signin = async function (req: any, res: any) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(201).json({
      message: "email is required",
    });
  }
  if (!password) {
    return res.status(201).json({
      message: "password is required",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(201).json({
      message: "please signup before trying to login",
    });
  }
  const hashedPassword = await bcrypt.compare(password, user.password);
  if (!hashedPassword) {
    return res.status(201).json({
      message: "enter the correct password",
    });
  }
  res.status(200).json({
    message: "login succesfull",
  });
};
