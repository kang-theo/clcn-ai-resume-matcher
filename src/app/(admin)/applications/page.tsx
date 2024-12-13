"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

// Remove mockApplications array and add interface
interface Application {
  id: string;
  status: string;
  online_resume: {
    title: string;
    summary: string;
  };
  job_description: {
    title: string;
    company: {
      name: string;
      location: string;
    };
    created_at: string;
    salary_range: {
      min: number;
      max: number;
      currency: string;
    } | null;
  };
  job_match?: {
    id: string;
    job_description_id: string;
    online_resume_id: string;
    overall_match_score: number;
    skill_match_score: number;
    experience_match_score: number;
    education_match_score: number;
    matching_skills: string[];
    missing_skills: string[];
    recommendations: string;
    created_at: string;
    updated_at: string;
  } | null;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/applications");
        const data = await response.json();
        if (data.meta.code === "OK") {
          setApplications(data.result.records);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications
    // .filter((app) => app.job_match?.overall_match_score >= 60 || true)
    .filter((app) => filter === "all" || app.status === filter)
    .filter(
      (app) =>
        app.job_description.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        app.job_description.company.name
          .toLowerCase()
          .includes(search.toLowerCase())
    );

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>My Applications</h1>
        <div className='flex gap-4'>
          <Input
            placeholder='Search jobs...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-64'
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
              <SelectItem value='approved'>Approved</SelectItem>
              <SelectItem value='rejected'>Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id} className='hover:bg-gray-50'>
                <TableCell className='font-medium'>
                  {application.job_description.title}
                </TableCell>
                <TableCell>
                  {application.job_description.company.name}
                </TableCell>
                <TableCell>
                  {new Date(
                    application.job_description.created_at
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {application.job_match ? (
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <div className='w-24 bg-gray-100 rounded-full h-2'>
                          <div
                            className='h-2 rounded-full transition-all'
                            style={{
                              width: `${application.job_match.overall_match_score}%`,
                              backgroundColor:
                                application.job_match.overall_match_score >= 80
                                  ? "#22c55e"
                                  : application.job_match.overall_match_score >=
                                    70
                                  ? "#3b82f6"
                                  : "#eab308",
                            }}
                          />
                        </div>
                        <span className='text-sm font-medium'>
                          {application.job_match.overall_match_score}%
                        </span>
                      </div>
                      <div className='flex gap-2 text-xs text-gray-500'>
                        <span>
                          Skills: {application.job_match.skill_match_score}%
                        </span>
                        <span>•</span>
                        <span>
                          Exp: {application.job_match.experience_match_score}%
                        </span>
                        <span>•</span>
                        <span>
                          Edu: {application.job_match.education_match_score}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className='text-gray-400'>No match data</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant='secondary'
                    className={
                      statusColors[
                        application.status as keyof typeof statusColors
                      ]
                    }
                  >
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {application.job_description.company.location}
                </TableCell>
                <TableCell>
                  {application.job_description.salary_range
                    ? `${
                        application.job_description.salary_range.currency
                      } ${Math.floor(
                        application.job_description.salary_range.min / 1000
                      )}K - ${
                        application.job_description.salary_range.currency
                      } ${Math.floor(
                        application.job_description.salary_range.max / 1000
                      )}K`
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
