import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

export async function listAllTags({
  page,
  pageSize,
  search,
  sortField,
  sortOrder,
}: ITableParams) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.tags.findMany({
      where: search,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.tags.count();
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
    return catchORMError("Failed to get tags", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function createTag({
  name,
  created_by,
}: {
  name: string;
  created_by: string;
}) {
  try {
    const newTag = await prisma.tags.create({
      data: { name },
    });

    if (newTag) {
      return {
        meta: {
          code: "OK",
        },
        data: newTag,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to create tag", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteTags(ids: string[]) {
  try {
    const deleteTags = await prisma.tags.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (deleteTags.count === ids.length) {
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
    return catchORMError("Failed to delete tags", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTag(tagId: string) {
  try {
    const tag = await prisma.tags.findUnique({
      where: {
        id: tagId,
      },
    });

    if (tag) {
      return {
        meta: {
          code: "OK",
        },
        data: tag,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to get tag", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateTag(
  tagId: string,
  payload: { name: string },
  operator: string
) {
  try {
    const tag = await prisma.tags.update({
      where: {
        id: tagId,
      },
      data: payload,
    });

    if (tag) {
      return {
        meta: {
          code: "OK",
        },
        data: tag,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to update tag", err);
  } finally {
    await prisma.$disconnect();
  }
}
