import React from "react";
import Resume from "@/components/client/resumes/Resume";

function ResumesPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Resume id={params.id} />
    </div>
  );
}

export default ResumesPage;
