import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

export async function listAllUsers({
  page,
  pageSize,
  search,
  sortField,
  sortOrder,
}: ITableParams) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.user.findMany({
      where: search,
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        roles: {
          select: {
            // who assigned this role and when
            assigned_at: true,
            assigned_by: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.user.count({ where: search });
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
    return catchORMError("Failed to get users", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function createUser(payload: API.UserPayload, operator: string) {
  try {
    const newUser = await prisma.user.create({
      data: {
        ...payload,
        roles: {
          create: payload.roles.map((role_id) => ({
            role_id,
            assigned_by: operator,
          })),
        },
      },
    });

    if (newUser) {
      return {
        meta: {
          code: "OK",
        },
        data: newUser,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to create user", err);
  } finally {
    await prisma.$disconnect();
  }
}

async function batchDeleteUsers(userIds: string[]) {
  return await prisma.$transaction(async (prisma: any) => {
    // Delete related records in RolesOnUsers
    await prisma.rolesOnUsers.deleteMany({
      where: {
        user_id: {
          in: userIds,
        },
      },
    });

    // Delete the user
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  });
}

export async function deleteUsers(ids: string[]) {
  return batchDeleteUsers(ids)
    .then(() => {
      return {
        meta: {
          code: "OK",
        },
      };
    })
    .catch((err) => {
      return catchORMError("Failed to delete users", err);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        linkedin: true,
        status: true,
        roles: {
          select: {
            // who assigned this role and when
            assigned_at: true,
            assigned_by: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    if (user) {
      return {
        meta: {
          code: "OK",
        },
        data: user,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to get user", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateUser(
  userId: string,
  payload: API.UserPayload,
  operator: string
) {
  try {
    const role = await prisma.user.update({
      where: {
        id: userId,
      },
      data: payload,
    });

    if (role) {
      return {
        meta: {
          code: "OK",
        },
        data: role,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to update user", err);
  } finally {
    await prisma.$disconnect();
  }
}
