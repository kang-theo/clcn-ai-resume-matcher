import { NextRequest, NextResponse } from "next/server";
import { getRole, updateRole } from "@/models/role";
// import { auth } from "@/lib/auth";
import { Session } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getRole(params.id);

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
  } catch (err) {
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
    // {selectedIds: []}
    // const session: Session | null = await auth();
    const payload = await request.json();
    const result = await updateRole(
      params.id,
      payload,
      "Admin" //(session?.user.username || session?.user.email)!
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
  } catch (err) {
    return NextResponse.json(
      { meta: { code: "E500", message: err.message } },
      { status: 500 }
    );
  }
}
