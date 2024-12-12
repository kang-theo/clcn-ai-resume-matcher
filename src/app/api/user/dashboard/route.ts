import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [applications, matchAnalysis, topMatches] = await Promise.all([
    // Get recent applications
    prisma.applications.findMany({
      where: { user_id: userId },
      include: {
        job_description: true,
        // JobMatch: true,
      },
      orderBy: { created_at: "desc" },
      take: 10,
    }),

    // Get skill match analysis
    prisma.jobMatch.findMany({
      where: {
        online_resume: {
          user_id: userId,
        },
      },
      select: {
        skill_match_score: true,
        experience_match_score: true,
        education_match_score: true,
      },
    }),

    // Get top matched jobs
    prisma.jobMatch.findMany({
      where: {
        online_resume: {
          user_id: userId,
        },
      },
      orderBy: {
        overall_match_score: "desc",
      },
      include: {
        job_description: true,
      },
      take: 3,
    }),
  ]);

  // Process the data
  return Response.json({
    // recentApplications: processApplicationHistory(applications),
    // skillMatchAnalysis: calculateSkillAnalysis(matchAnalysis),
    // topMatchedJobs: processTopMatches(topMatches),
    // applicationStatus: calculateApplicationStatus(applications),
  });
}
