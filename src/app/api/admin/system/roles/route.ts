import {
  convertSearchParamsToWhereClause,
  convertSortParams,
} from "@/lib/utils";
// import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { createRole, listAllRoles, deleteRoles } from "@/models/role";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams,
    page = searchParams.get("page") || "1",
    pageSize = searchParams.get("pageSize") || "10",
    sortField = searchParams.get("sortField") || "created_at",
    sortOrder = convertSortParams(searchParams.get("sortOrder")) || "desc",
    whereClause = convertSearchParamsToWhereClause(searchParams);

  try {
    const result: API.ModelRes = await listAllRoles({
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      search: whereClause,
      sortField,
      sortOrder,
    });

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

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    // const session: Session | null = await auth();
    const result: API.ModelRes = await createRole({
      ...payload,
      created_by: "Admin", //session?.user.username,
    });
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

export async function DELETE(req: NextRequest) {
  const payload = await req.json();

  try {
    const result: API.ModelRes = await deleteRoles(payload.ids);

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: { code: "OK" },
      });
    } else {
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json(
      { meta: { code: "E500", message: err.message } },
      { status: 500 }
    );
  }
}
