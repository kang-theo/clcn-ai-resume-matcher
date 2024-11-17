import { NextRequest, NextResponse } from "next/server";
import {
  catchError,
  convertSortParams,
  convertSearchParamsToWhereClause,
} from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { getResume, updateResume } from "@/models/online-resume";

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
    const result: API.ModelRes = await getResume(params.id);

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
    const payload = await request.json();
    const result: API.ModelRes = await updateResume({
      id: params.id,
      content: payload,
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
