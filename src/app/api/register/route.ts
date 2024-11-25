import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerUserSchema } from "@/lib/schema";
import { catchError } from "@/lib/utils";

export const POST = async (req: NextRequest) => {
  try {
    const payload = await req.json();
    const validation = registerUserSchema.safeParse(payload);
    if (!validation.success) {
      return NextResponse.json(
        {
          meta: {
            code: 400,
            message: validation.error.errors
              ?.map((item: { message: string }) => item.message)
              .join(", "),
          },
        },
        { status: 400 }
      );
    }

    const { email, username, password } = validation.data;
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
      return NextResponse.json({
        meta: {
          code: 400,
          message: "User already exists",
        },
      });
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
  } catch (error: any) {
    return NextResponse.json(
      {
        meta: {
          code: error.response?.status || "Bad Request",
          message: catchError(error),
        },
      },
      {
        status: error.response?.status || 400,
      }
    );
  }
};
