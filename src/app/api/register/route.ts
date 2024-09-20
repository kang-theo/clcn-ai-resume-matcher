// npm install @prisma/client @auth/prisma-adapter zod bcrypt
// npm install prisma @types/bcryptjs --save-dev
// npx prisma init
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserSchema as registerUserSchema } from "@/lib/schema";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const payload = await req.json();
    // validate the payload with defined schema
    const { email, username, password } = registerUserSchema.parse(payload);
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
            code: 400,
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
        { meta: { code: "OK" } },
        {
          status: 201,
        }
      );
    } else {
      return NextResponse.json({
        meta: { code: 500, message: "Failed to create user in database" },
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        meta: {
          code: err.response.status || "Bad Request",
          message:
            err?.message || "Failed to create account, please contact support",
        },
      },
      {
        status: err.response.status || 400,
      }
    );
  }
};

// signIn is managed by next-auth.js
