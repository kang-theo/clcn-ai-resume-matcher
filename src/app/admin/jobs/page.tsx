import JobList from "@/components/jobs";

export default function JobsPage() {
  return (
    <div>
      <JobList title='' url='/api/admin/jobs' />
    </div>
  );
}
