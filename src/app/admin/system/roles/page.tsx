import RoleList from "@/components/system/roles";

export default function SystemRolesPage() {
  return (
    <div>
      <RoleList title='' url='/api/admin/system/roles' />
    </div>
  );
}
