import { NextRequest, NextResponse } from "next/server";
import { getTag, updateTag } from "@/models/tag";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
/*
  Bleow option is when you want no caching at all, there are more options
  on the doc depending on your needs. 
*/
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result: API.ModelRes = await getTag(params.id);

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: { code: "OK" },
        result: result.data,
      });
    } else {
      return NextResponse.json(
        { meta: { code: "E500", message: result.meta.message } },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { meta: { code: "E500", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session: Session | null = await auth();

    const result: API.ModelRes = await updateTag(
      params.id,
      await request.json(),
      session?.user?.email!
    );

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: { code: "OK" },
        result: result.data,
      });
    } else {
      return NextResponse.json(
        { meta: { code: "E500", message: result.meta.message } },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { meta: { code: "E500", message: err.message } },
      { status: 500 }
    );
  }
}
