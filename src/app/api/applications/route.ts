import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createApplication, listAllApplications } from "@/models/application";
import {
  convertSortParams,
  convertSearchParamsToWhereClause,
} from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          meta: {
            code: "ERROR",
            message: "Unauthorized",
          },
        },
        { status: 401 }
      );
    }

    // let applications;

    // // Handle different user roles
    // switch (userRole) {
    //   case "ADMIN":
    //     // Admin can see all applications
    //     applications = await prisma.application.findMany({
    //       include: {
    //         job: {
    //           include: {
    //             company: true,
    //           },
    //         },
    //         user: {
    //           select: {
    //             id: true,
    //             name: true,
    //             email: true,
    //           },
    //         },
    //       },
    //       orderBy: {
    //         createdAt: "desc",
    //       },
    //     });
    //     break;

    //   case "HR":
    //     // HR can see applications for their company's jobs
    //     applications = await prisma.application.findMany({
    //       where: {
    //         job: {
    //           companyId: session.user.companyId, // Assuming HR has companyId in session
    //         },
    //       },
    //       include: {
    //         job: {
    //           include: {
    //             company: true,
    //           },
    //         },
    //         user: {
    //           select: {
    //             id: true,
    //             name: true,
    //             email: true,
    //           },
    //         },
    //       },
    //       orderBy: {
    //         createdAt: "desc",
    //       },
    //     });
    //     break;

    //   default:
    //     // Regular users can only see their own applications
    //     applications = await prisma.application.findMany({
    //       where: {
    //         userId: userId,
    //       },
    //       include: {
    //         job: {
    //           include: {
    //             company: true,
    //           },
    //         },
    //       },
    //       orderBy: {
    //         createdAt: "desc",
    //       },
    //     });
    //     break;
    // }

    // // Transform the data to match the frontend schema
    // const transformedApplications = applications.map((app) => ({
    //   id: app.id,
    //   jobTitle: app.job.title,
    //   company: app.job.company.name,
    //   appliedDate: app.createdAt.toISOString(),
    //   status: app.status.toLowerCase(),
    //   matchScore: {
    //     overall: app.matchScore.overall,
    //     skills: app.matchScore.skills,
    //     experience: app.matchScore.experience,
    //     education: app.matchScore.education,
    //   },
    //   location: app.job.location,
    //   salary: `${app.job.salaryRange.min}-${app.job.salaryRange.max}`,
    // }));

    const searchParams = request.nextUrl.searchParams,
      page = searchParams.get("page") || "1",
      pageSize = searchParams.get("pageSize") || "10",
      sortField = searchParams.get("sortField") || "created_at",
      sortOrder = convertSortParams(searchParams.get("sortOrder")) || "desc",
      status = searchParams.get("status") || "pending",
      whereClause = convertSearchParamsToWhereClause(searchParams);

    const result: API.ModelRes = await listAllApplications({
      status: status as "pending" | "approved" | "rejected",
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      search: whereClause,
      sortField,
      sortOrder,
      currentUser: {
        id: session.user.id!,
        email: session.user.email!,
        roles: session.user.roles!,
      },
    });

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: {
          code: "OK",
          message: "Success",
        },
        result: result.data,
      });
    } else {
      return NextResponse.json(
        {
          meta: result.meta,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      {
        meta: {
          code: "ERROR",
          message: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      console.log(2222);
      return NextResponse.json(
        {
          meta: {
            code: "ERROR",
            message: "Unauthorized",
          },
        },
        { status: 401 }
      );
    }

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json(
        {
          meta: {
            code: "ERROR",
            message: "Job ID is required",
          },
        },
        { status: 400 }
      );
    }

    const result: API.ModelRes = await createApplication({
      user_id: session.user.id!,
      job_description_id: jobId,
    });

    return NextResponse.json(result, {
      status: result.meta.code === "ERROR" ? 400 : 200,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      {
        meta: {
          code: "ERROR",
          message: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
