import TagList from "@/components/tags";

export default function JobsPage() {
  return (
    <div>
      <TagList title='' url='/api/admin/tags' />
    </div>
  );
}
