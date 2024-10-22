import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

export async function listAllQuestionaires({
  page,
  pageSize,
  search,
  sortField,
  sortOrder,
}: ITableParams) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.questionaires.findMany({
      where: search,
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        updated_at: true,
        standard_scores: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.questionaires.count({ where: search });
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
    return catchORMError("Failed to get questionaires", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function createQuestionaire(
  payload: API.NewQuestionairePayload,
  operator: string
) {
  try {
    const newQuestionaire = await prisma.questionaires.create({
      data: {
        ...payload,
      },
    });

    if (newQuestionaire) {
      return {
        meta: {
          code: "OK",
        },
        data: newQuestionaire,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to create questionaire", err);
  } finally {
    await prisma.$disconnect();
  }
}

async function batchDeleteQuestionaires(questionaireIds: string[]) {
  return await prisma.$transaction(async (prisma: any) => {
    // Delete related records in RolesOnQuestionaires
    await prisma.rolesOnQuestionaires.deleteMany({
      where: {
        questionaire_id: {
          in: questionaireIds,
        },
      },
    });

    // Delete the questionaire
    await prisma.questionaire.deleteMany({
      where: {
        id: {
          in: questionaireIds,
        },
      },
    });
  });
}

export async function deleteQuestionaires(ids: string[]) {
  return batchDeleteQuestionaires(ids)
    .then(() => {
      return {
        meta: {
          code: "OK",
        },
      };
    })
    .catch((err) => {
      return catchORMError("Failed to delete questionaires", err);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export async function getQuestionaire(questionaireId: string) {
  try {
    const questionaire = await prisma.questionaires.findUnique({
      where: {
        id: questionaireId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        updated_at: true,
        questionaire_items: true,
      },
    });

    if (questionaire) {
      return {
        meta: {
          code: "OK",
        },
        data: questionaire,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to get questionaire", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateQuestionaire(
  questionaireId: string,
  payload: API.UpdateQuestionarePayload,
  operator: string
) {
  try {
    const role = await prisma.questionaires.update({
      where: {
        id: questionaireId,
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
    return catchORMError("Failed to update questionaire", err);
  } finally {
    await prisma.$disconnect();
  }
}
