import { NextRequest, NextResponse } from "next/server";
import {
  catchError,
  convertSortParams,
  convertSearchParamsToWhereClause,
} from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import {
  createOnlineResume,
  listAllOnlineResumes,
} from "@/models/online-resume";

/*
  Bleow option is when you want no caching at all, there are more options
  on the doc depending on your needs. 
*/
export const dynamic = "force-dynamic";

// Get all my online resumes
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams,
    page = searchParams.get("page") || "1",
    pageSize = searchParams.get("pageSize") || "10",
    sortField = searchParams.get("sortField") || "created_at",
    sortOrder = convertSortParams(searchParams.get("sortOrder")) || "desc",
    whereClause = convertSearchParamsToWhereClause(searchParams);
  const session: Session | null = await auth();
  try {
    const result: API.ModelRes = await listAllOnlineResumes(
      {
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        search: whereClause,
        sortField,
        sortOrder,
      },
      session?.user?.id
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

// Save my online resume
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session: Session | null = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          meta: {
            code: "Unauthorized",
            message: "Unauthorized",
          },
        },
        { status: 403 }
      );
    }

    const payload = {
      content: body,
      user_id: session.user.id!,
    };

    // const validation = newOnlineResume.safeParse(payload);
    // if (!validation.success) {
    //   return NextResponse.json(
    //     { meta: { code: "E400", message: validation.error.errors } },
    //     { status: 400 }
    //   );
    // }

    const result: API.ModelRes = await createOnlineResume(payload);

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: {
          code: "OK",
        },
      });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: catchError(error) },
      { status: 500 }
    );
  }
}

// Delete online resume
// export async function DELETE(request: NextRequest) {
//   try {
//     const body = await request.json();

//     const validation = deleteItemsSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { meta: { code: "E400", message: validation.error.errors } },
//         { status: 400 }
//       );
//     }

//     const result: API.ModelRes = await deleteOnlineResumes(body);

//     if (result.meta.code === "OK") {
//       return NextResponse.json(result);
//     } else {
//       return NextResponse.json(result, { status: 500 });
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { code: 500, message: catchError(error) },
//       { status: 500 }
//     );
//   }
// }
