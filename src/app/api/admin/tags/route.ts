import {
  convertSearchParamsToWhereClause,
  convertSortParams,
} from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { createTag, listAllTags, deleteTags } from "@/models/tag";
import { NextRequest, NextResponse } from "next/server";
import { newTagSchema } from "@/lib/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams,
    page = searchParams.get("page") || "1",
    pageSize = searchParams.get("pageSize") || "10",
    sortField = searchParams.get("sortField") || "created_at",
    sortOrder = convertSortParams(searchParams.get("sortOrder")) || "desc",
    whereClause = convertSearchParamsToWhereClause(searchParams);

  try {
    const result: API.ModelRes = await listAllTags({
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
    console.log(err);
    return NextResponse.json(
      { meta: { code: "E500", message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const session: Session | null = await auth();

    const validation = newTagSchema.safeParse({
      ...payload,
    });

    if (!validation.success) {
      return NextResponse.json(
        { meta: { code: "E400", message: validation.error.errors } },
        { status: 400 }
      );
    }

    const result: API.ModelRes = await createTag({
      ...payload,
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
    const result = await deleteTags(payload.ids);

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
