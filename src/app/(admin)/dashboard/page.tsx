"use client";

import { Card } from "@/components/ui/card";
import { Line, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

// Mock data - replace with real data from your API
const mockUserStats = {
  recentApplications: [
    { date: "2024-01", count: 5, averageMatch: 78 },
    { date: "2024-02", count: 8, averageMatch: 82 },
    { date: "2024-03", count: 6, averageMatch: 85 },
  ],
  skillMatchAnalysis: {
    technicalSkills: 85,
    softSkills: 75,
    experience: 80,
    education: 90,
    industryKnowledge: 70,
  },
  applicationStatus: {
    pending: 4,
    approved: 12,
    rejected: 3,
  },
  topMatchedJobs: [
    { title: "Senior Frontend Developer", matchScore: 92 },
    { title: "Full Stack Engineer", matchScore: 88 },
    { title: "React Developer", matchScore: 85 },
  ],
};

// Define a professional color palette
const chartColors = {
  primary: {
    main: "rgb(59, 130, 246)", // Blue
    light: "rgba(59, 130, 246, 0.2)",
    dark: "rgb(29, 78, 216)",
  },
  secondary: {
    main: "rgb(139, 92, 246)", // Purple
    light: "rgba(139, 92, 246, 0.2)",
    dark: "rgb(109, 40, 217)",
  },
  success: {
    main: "rgb(34, 197, 94)", // Green
    light: "rgba(34, 197, 94, 0.2)",
    dark: "rgb(21, 128, 61)",
  },
  warning: {
    main: "rgb(234, 179, 8)", // Yellow
    light: "rgba(234, 179, 8, 0.2)",
    dark: "rgb(161, 98, 7)",
  },
  error: {
    main: "rgb(239, 68, 68)", // Red
    light: "rgba(239, 68, 68, 0.2)",
    dark: "rgb(185, 28, 28)",
  },
  neutral: {
    main: "rgb(100, 116, 139)", // Slate
    light: "rgba(100, 116, 139, 0.2)",
    dark: "rgb(51, 65, 85)",
  },
};

// Update chart data configurations
const applicationHistory = {
  labels: mockUserStats.recentApplications.map((app) => app.date),
  datasets: [
    {
      label: "Applications",
      data: mockUserStats.recentApplications.map((app) => app.count),
      borderColor: chartColors.primary.main,
      backgroundColor: chartColors.primary.light,
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
    {
      label: "Average Match Score",
      data: mockUserStats.recentApplications.map((app) => app.averageMatch),
      borderColor: chartColors.secondary.main,
      backgroundColor: chartColors.secondary.light,
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
};

const skillsAnalysis = {
  labels: Object.keys(mockUserStats.skillMatchAnalysis),
  datasets: [
    {
      label: "Skill Match %",
      data: Object.values(mockUserStats.skillMatchAnalysis),
      backgroundColor: chartColors.primary.light,
      borderColor: chartColors.primary.main,
      pointBackgroundColor: chartColors.primary.dark,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: chartColors.primary.main,
      borderWidth: 2,
    },
  ],
};

const applicationStatus = {
  labels: ["Pending", "Approved", "Rejected"],
  datasets: [
    {
      data: Object.values(mockUserStats.applicationStatus),
      backgroundColor: [
        chartColors.warning.main,
        chartColors.success.main,
        chartColors.error.main,
      ],
      borderColor: "white",
      borderWidth: 2,
    },
  ],
};

// Update common options with consistent styling
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        boxWidth: 20,
        padding: 20,
        font: {
          size: 12,
          family: "'Inter', sans-serif", // Assuming you're using Inter font
        },
        color: chartColors.neutral.dark,
      },
    },
    tooltip: {
      backgroundColor: "white",
      titleColor: chartColors.neutral.dark,
      bodyColor: chartColors.neutral.dark,
      borderColor: chartColors.neutral.light,
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      bodyFont: {
        family: "'Inter', sans-serif",
      },
    },
  },
};

export default function UserDashboard() {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Your Job Search Dashboard</h1>

      {/* Top Matched Jobs */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold mb-4'>Top Matched Jobs</h2>
        <div className='space-y-4'>
          {mockUserStats.topMatchedJobs.map((job) => (
            <div key={job.title} className='flex items-center justify-between'>
              <span className='font-medium'>{job.title}</span>
              <div className='flex items-center'>
                {/* Progress bar container with background */}
                <div className='w-32 bg-gray-100 rounded-full h-2.5 dark:bg-gray-700'>
                  {/* Progress bar fill */}
                  <div
                    className='h-2.5 rounded-full transition-all duration-300 ease-in-out'
                    style={{
                      width: `${job.matchScore}%`,
                      backgroundColor:
                        job.matchScore > 90
                          ? chartColors.success.main
                          : job.matchScore > 80
                          ? chartColors.primary.main
                          : chartColors.warning.main,
                    }}
                  ></div>
                </div>
                <span className='ml-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {job.matchScore}% match
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Application History Chart */}
        <Card className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>Application History</h2>
          <div className='relative h-[300px] w-full'>
            <Line
              data={applicationHistory}
              options={{
                ...commonOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      maxTicksLimit: 5,
                      callback: (value) => `${value}%`,
                    },
                  },
                  x: {
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Skills Analysis */}
        <Card className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>Skills Match Analysis</h2>
          <div className='relative h-[300px] w-full'>
            <Radar
              data={skillsAnalysis}
              options={{
                ...commonOptions,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      stepSize: 20,
                    },
                    pointLabels: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Application Status */}
        <Card className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>Application Status</h2>
          <div className='relative h-[300px] w-full'>
            <Doughnut
              data={applicationStatus}
              options={{
                ...commonOptions,
                cutout: "60%",
                plugins: {
                  ...commonOptions.plugins,
                  legend: {
                    ...commonOptions.plugins.legend,
                    position: "right" as const,
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
