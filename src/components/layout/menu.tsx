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
  getItem("Dashboard", "/dashboard", <LayoutGrid size={20} />),
  getItem("Positions", "/positions", <List size={20} />),
  getItem("Questionnaires", "/questionnaires", <FileQuestion size={20} />),
  getItem("Resumes", "/resumes", <FileBox size={20} />),
  getItem("Reports", "/reports", <NotebookText size={20} />),
  getItem("Interviews", "/interviews", <BookText size={20} />),
  getItem("Offers", "/offers", <MailCheck size={20} />),
  getItem("Emails", "/emails", <Mail size={20} />),
  getItem("System", "/system", <Settings size={20} />, [
    getItem("Users", "/system/users", <Users size={20} />),
    getItem("Roles", "/system/roles", <Drama size={20} />),
    getItem("Logs", "/system/logs", <Logs size={20} />),
    getItem("Settings", "/system/settings", <Settings size={20} />),
  ]),
];
