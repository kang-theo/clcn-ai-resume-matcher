import UserList from "@/components/system/users";

export default function SystemUsersPage() {
  return (
    <div>
      <UserList title='' url='/api/admin/system/users' />
    </div>
  );
}
