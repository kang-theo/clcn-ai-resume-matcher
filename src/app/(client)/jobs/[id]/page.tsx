import JobDetail from "@/components/jobs/JobDetail";
import React from "react";

function JobDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <JobDetail id={params.id} />
    </div>
  );
}

export default JobDetailPage;
