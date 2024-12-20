import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import { Prisma } from "@/lib/prisma";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

// Combine tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Catch prisma ORM error
 * @param defaultMsg
 * @param err
 * @returns {IApiRes}
 */
export function catchORMError(defaultMsg: string, err?: unknown) {
  // type narrowing
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      meta: {
        code: "ERROR",
        message: err.message,
      },
    };
  }

  return {
    meta: {
      code: "ERROR",
      message: defaultMsg,
    },
  };
}

// Catch errors from axios for server-side
export function catchError(error: unknown) {
  let errorMessage: string;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status other than 2xx
      errorMessage = `Server responded with status ${error.response.status}: ${
        error.response.data?.message || error.response.statusText
      }`;
    } else if (error.request) {
      // No response was received
      errorMessage = "No response received from the server";
    } else {
      // Error setting up the request
      errorMessage = `Error setting up the request: ${error.message}`;
    }
  } else {
    // Non-Axios error
    errorMessage = `Unexpected error: ${(error as Error).message}`;
  }
  return errorMessage;
}

// Flattens nested query parameters into a single level
// Call backend with a flattened query string
export function flattenSearchParams(
  searchParams: URLSearchParams
): URLSearchParams {
  const flatQuery = new URLSearchParams();

  searchParams.forEach((value, key) => {
    if (key.includes("[") && key.includes("]")) {
      const match = key.match(/\[(.*?)\]/);
      if (match && match[1]) {
        flatQuery.append(match[1], value);
      }
    } else {
      flatQuery.append(key, value);
    }
  });

  return flatQuery;
}

/**
 * Convert UTC time string to browser local time
 * @param datetimeStr UTC time string, for example: '2023-10-06T12:00:00Z'
 */
export function formatDatetime(datetimeStr: string) {
  // ---------------original solution----------------
  // Parse the datetime string into a Date object
  // const date = new Date(datetimeStr);

  // // Get the localized components using toLocaleString with options
  // const options: Record<string, string | boolean> = {
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit',
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit',
  //   hour12: false, // Use 24-hour time
  //   timeZoneName: 'short', // This is optional
  // };
  // const parts = new Intl.DateTimeFormat('default', options).formatToParts(date.toLocaleString(locale, options));

  // // Extract components
  // const formattedParts: Record<string, any> = {};
  // parts.forEach(({ type, value }) => {
  //   formattedParts[type] = value;
  // });

  // // Construct the formatted datetime string
  // return `${formattedParts.year}-${formattedParts.month}-${formattedParts.day} ${formattedParts.hour}:${formattedParts.minute}:${formattedParts.second}`;

  // -------------dayjs solution ----------------------
  // system already depend on dayjs in antd
  const format: string = "MM/DD YYYY HH:mm";
  return dayjs.utc(datetimeStr).local().format(format);
}

export function catchClientRequestError(error: any) {
  if (error.code === "ECONNABORTED") {
    // Timeout
    return {
      message: "Timeout to fetch data, please try again later.",
    };
  } else if (error.response && error.response.status === 403) {
    return {
      message: "You do not have permission to access this resource.",
    };
  } else {
    return {
      message:
        error.response.data.message ||
        "Failed to fetch data, please try again later.",
    };
  }
}

export function convertSortParams(sortOrder: string | null) {
  if (sortOrder === "ascend") {
    return "asc";
  } else if (sortOrder === "descend") {
    return "desc";
  }
}

export function convertSearchParamsToWhereClause(
  searchParams: URLSearchParams
) {
  // Parse the search parameters
  const search: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith("search[") && key.endsWith("]")) {
      const fieldName = key.slice(7, -1); // Extract the field name between 'search[' and ']'
      search[fieldName] = value;
    }
  });

  const whereClause = Object.keys(search).reduce((acc, key) => {
    acc[key] = {
      contains: search[key],
      mode: "insensitive", // Optional: case-insensitive search
    };
    return acc;
  }, {} as Record<string, any>);

  return whereClause;
}

export function calculateTimeDifference(updatedTime: string): string {
  const updatedDate = new Date(updatedTime);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const diffInMilliseconds = currentDate.getTime() - updatedDate.getTime();

  // Convert milliseconds to hours and days
  const millisecondsPerHour = 1000 * 60 * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;

  const totalHoursAgo = Math.floor(diffInMilliseconds / millisecondsPerHour);
  const daysAgo = Math.floor(diffInMilliseconds / millisecondsPerDay);

  if (totalHoursAgo >= 24) {
    return `${daysAgo} days ago`;
  } else {
    return `${totalHoursAgo} hours ago`;
  }
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
