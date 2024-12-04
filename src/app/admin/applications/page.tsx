import ApplicationList from "@/components/applications";

export default function JobsPage() {
  return (
    <div>
      <ApplicationList title='' url='/api/admin/applications' />
    </div>
  );
}
