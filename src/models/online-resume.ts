import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

export async function listAllOnlineResumes(
  { page, pageSize, search, sortField, sortOrder }: ITableParams,
  userId?: string | undefined
) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.onlineResumes.findMany({
      where: {
        ...search,
        user_id: userId,
      },
      select: {
        id: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.onlineResumes.count({
      where: {
        ...search,
        user_id: userId,
      },
    });
    // const totalPages = Math.ceil(total / pageSize);
    return {
      meta: {
        code: "OK",
      },
      data: {
        records,
        total,
        // totalPages,
        pagination: {
          total,
          pageSize,
          page,
        },
      },
    };
  } catch (err) {
    return catchORMError("Failed to get online resumes", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function createOnlineResume({
  user_id,
  content,
}: {
  user_id: string;
  content: Record<string, any>;
}) {
  try {
    const onlineResume = await prisma.onlineResumes.create({
      data: {
        user_id,
        content,
      },
    });

    if (onlineResume) {
      return {
        meta: {
          code: "OK",
        },
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to create online resume", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getResume(id: string) {
  try {
    const resume = await prisma.onlineResumes.findUnique({
      where: {
        id,
      },
    });

    if (resume) {
      return {
        meta: {
          code: "OK",
        },
        data: resume,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to get online resume", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateResume({
  id,
  content,
}: {
  id: string;
  content: Record<string, any>;
}) {
  try {
    const onlineResume = await prisma.onlineResumes.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });

    if (onlineResume) {
      return {
        meta: {
          code: "OK",
        },
        data: onlineResume,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to update online resume", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteOnlineResumes({ ids }: { ids: string[] }) {
  try {
    // TODO
  } catch (err) {
    return catchORMError("Failed to delete online resumes", err);
  } finally {
    await prisma.$disconnect();
  }
}
