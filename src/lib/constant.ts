export const USER_STATUS = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
  Deleted: "DELETED",
};

// Define tag color mapping
export const TAG_COLORS: { [key: string]: string } = {
  Remote: "bg-orange-100 text-orange-900",
  Hybrid: "bg-yellow-100 text-yellow-900",
  "On-site": "bg-green-100 text-green-900",

  // Experience levels
  "Entry Level": "bg-purple-100 text-purple-900",
  "Mid Level": "bg-blue-100 text-blue-900",
  "Senior Level": "bg-indigo-100 text-indigo-900",

  // Department/Field
  Engineering: "bg-cyan-100 text-cyan-900",
  Finance: "bg-emerald-100 text-emerald-900",
  Design: "bg-pink-100 text-pink-900",

  // Job types
  "Full Stack": "bg-violet-100 text-violet-900",
  Frontend: "bg-rose-100 text-rose-900",
  Backend: "bg-sky-100 text-sky-900",

  // Industry
  Tech: "bg-amber-100 text-amber-900",
  Healthcare: "bg-lime-100 text-lime-900",

  // Company size
  Startup: "bg-fuchsia-100 text-fuchsia-900",
  Enterprise: "bg-red-100 text-red-900",

  // Default color for any unmatched tags
  default: "bg-gray-100 text-gray-900",
};
