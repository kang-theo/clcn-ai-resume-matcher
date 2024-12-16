import { JobsList } from "@/components/jobs/JobsList";
import React from "react";

function JobsPage({ params }: { params: { status: string } }) {
  return (
    <div>
      <JobsList status={params.status as "all" | "Draft" | "Open" | "Closed"} />
    </div>
  );
}

export default JobsPage;
