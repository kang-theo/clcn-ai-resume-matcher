import type { MenuProps } from "antd";
import {
  Drama,
  FileBox,
  KeyRound,
  LayoutGrid,
  Megaphone,
  Settings,
  Users,
  View,
  Store,
  CircleDollarSign,
  PhoneMissed,
  Mail,
  Logs,
  MailCheck,
  BookText,
  NotebookText,
  FileQuestion,
  List,
} from "lucide-react";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// TODO(Refactor): It could come from the backend for RBAC
export const items: MenuItem[] = [
  getItem("Dashboard", "/admin/dashboard", <LayoutGrid size={20} />),
  getItem("Jobs", "/admin/jobs", <List size={20} />, [
    getItem("All", "/admin/jobs", <List size={20} />),
    getItem("Tags", "/admin/tags", <List size={20} />),
  ]),
  getItem(
    "Questionnaires",
    "/admin/questionaires",
    <FileQuestion size={20} />,
    [
      getItem("All", "/admin/questionaires", <List size={20} />),
      getItem("Items", "/admin/questionaires/items", <List size={20} />),
      getItem(
        "Options",
        "/admin/questionaires/item-options",
        <List size={20} />
      ),
    ]
  ),
  getItem("Resumes", "/admin/resumes", <FileBox size={20} />),
  getItem("Applications", "/admin/applications", <List size={20} />),
  getItem("Interviews", "/admin/interviews", <BookText size={20} />),
  getItem("Offers", "/admin/offers", <MailCheck size={20} />),
  getItem("Emails", "/admin/emails", <Mail size={20} />),
  getItem("System", "/admin/system", <Settings size={20} />, [
    getItem("Users", "/admin/system/users", <Users size={20} />),
    getItem("Roles", "/admin/system/roles", <Drama size={20} />),
    getItem("Logs", "/admin/system/logs", <Logs size={20} />),
    getItem("Settings", "/admin/system/settings", <Settings size={20} />),
  ]),
];
