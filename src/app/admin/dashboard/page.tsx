import { Dashboard } from "@/components/dashboard";
import {
  AppWindow,
  Brain,
  Calculator,
  CalendarCheck,
  Computer,
  FileBox,
  Monitor,
  MonitorSmartphone,
  Tags,
} from "lucide-react";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const businessOverviewItems = [
  {
    title: "Positions",
    unit: "",
    value: 999,
    trend: 45.3,
  },
  {
    title: "Resumes",
    unit: "",
    value: 780,
    trend: 70.2,
    info: "System already received the resumes, it is total number of resumes",
  },
  {
    title: "Questionaires",
    unit: "",
    value: 80,
  },
  {
    title: "Reports",
    unit: "",
    value: 1200,
    trend: -9.9,
  },
  {
    title: "Interviews",
    unit: "",
    value: 520,
    trend: 45.3,
    info: "System already sent the interview invitations",
  },
  {
    title: "Offers",
    unit: "",
    value: 500,
    trend: 37.9,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <Dashboard
        basePath={basePath}
        businessOverviewItems={businessOverviewItems}
      />
    </div>
  );
}
