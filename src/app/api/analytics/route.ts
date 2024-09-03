import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { catchError, flattenSearchParams } from "@/lib/utils";
import { getDashboardAnalyticsData } from "@/mock/analytics";

const API_HOST = process.env.API_HOST;
/*
  Bleow option is when you want no caching at all, there are more options
  on the doc depending on your needs. 
*/
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Request base backend API
    // const { data } = await axios.get(
    //   `${API_HOST}/profits`
    // );

    // Convert back to a string for demonstration purposes
    // const flattenedQueryString = flattenedQuery.toString();

    const data = {
      code: 0,
      result: {
        positions: {
          name: "Positions",
          result: getDashboardAnalyticsData(),
        },
        resumes: {
          name: "Resumes",
          result: getDashboardAnalyticsData(),
        },
        offers: {
          name: "Offers",
          result: getDashboardAnalyticsData(),
        },
      },
    };

    if (!data.code) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        // { meta: { code: "E500", message: data.message}},
        data,
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: catchError(error) },
      { status: 500 }
    );
  }
}
