import { ApplicationsList } from "@/components/applications/ApplicationsList";

export default function ApplicationsPage({
  params,
}: {
  params: { status: string };
}) {
  return (
    <div>
      <ApplicationsList
        status={params.status as "pending" | "approved" | "rejected"}
      />
    </div>
  );
}
