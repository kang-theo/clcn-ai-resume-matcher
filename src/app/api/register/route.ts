import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const payload = await req.json();
    const { email, username, password } = payload;

    const user = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              equals: email,
            },
          },
          {
            username: {
              equals: username,
            },
          },
        ],
      },
    });

    // user exists
    if (user && user.length) {
      return NextResponse.json(
        {
          meta: {
            code: "USER_EXISTS",
            message: "User already exists",
          },
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    if (newUser) {
      return NextResponse.json(
        {
          meta: {
            code: "OK",
            message: "Created a new user successfully",
          },
        },
        {
          status: 201,
        }
      );
    } else {
      return NextResponse.json(
        {
          meta: {
            code: "SERVER_ERROR",
            message: "Failed to create user in database",
          },
        },
        {
          status: 500,
        }
      );
    }
  } catch (err: any) {
    console.error("Error parsing request:", err.errors);
    return NextResponse.json(
      {
        meta: {
          code: err?.response?.status || "Bad Request",
          message:
            err?.message || "Failed to create account, please contact support",
        },
      },
      {
        status: err?.response?.status || 400,
      }
    );
  }
};

// signIn is managed by next-auth.js
