import RoleList from "@/components/system/roles";

export default function SystemRolesPage() {
  return (
    <div>
      <RoleList title='' url='/api/system/roles' />
    </div>
  );
}
