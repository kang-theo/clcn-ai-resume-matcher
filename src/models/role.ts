import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

export async function listAllRoles({
  page,
  pageSize,
  search,
  sortField,
  sortOrder,
}: ITableParams) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.role.findMany({
      where: search,
      select: {
        id: true,
        name: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        last_modifier: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.role.count();
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
    return catchORMError("Failed to get roles", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function createRole({
  name,
  created_by,
}: {
  name: string;
  created_by: string;
}) {
  try {
    const newRole = await prisma.role.create({
      data: { name, created_by },
    });

    if (newRole) {
      return {
        meta: {
          code: "OK",
        },
        data: newRole,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to create role", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteRoles(ids: string[]) {
  try {
    const deleteRoles = await prisma.role.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (deleteRoles.count === ids.length) {
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
    return catchORMError("Failed to delete roles", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getRole(roleId: string) {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id: roleId,
      },
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
    return catchORMError("Failed to get role", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateRole(
  roleId: string,
  payload: { name: string },
  operator: string
) {
  try {
    const role = await prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        ...payload,
        last_modifier: operator,
      },
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
    return catchORMError("Failed to update role", err);
  } finally {
    await prisma.$disconnect();
  }
}
