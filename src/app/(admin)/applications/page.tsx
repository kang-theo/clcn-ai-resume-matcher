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
import { useState } from "react";

// Mock data
const mockApplications = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "Tech Corp",
    appliedDate: "2024-03-15",
    status: "pending",
    matchScore: {
      overall: 85,
      skills: 90,
      experience: 82,
      education: 88,
    },
    location: "Remote",
    salary: "$120k - $150k",
  },
  {
    id: "2",
    jobTitle: "Full Stack Engineer",
    company: "StartUp Inc",
    appliedDate: "2024-03-14",
    status: "approved",
    matchScore: {
      overall: 78,
      skills: 75,
      experience: 80,
      education: 85,
    },
    location: "New York, NY",
    salary: "$100k - $130k",
  },
  // Add more mock applications...
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredApplications = mockApplications
    .filter((app) => app.matchScore.overall >= 60) // Basic score filter
    .filter((app) => filter === "all" || app.status === filter)
    .filter(
      (app) =>
        app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        app.company.toLowerCase().includes(search.toLowerCase())
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
                  {application.jobTitle}
                </TableCell>
                <TableCell>{application.company}</TableCell>
                <TableCell>
                  {new Date(application.appliedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <div className='w-24 bg-gray-100 rounded-full h-2'>
                        <div
                          className='h-2 rounded-full transition-all'
                          style={{
                            width: `${application.matchScore.overall}%`,
                            backgroundColor:
                              application.matchScore.overall >= 80
                                ? "#22c55e"
                                : application.matchScore.overall >= 70
                                ? "#3b82f6"
                                : "#eab308",
                          }}
                        />
                      </div>
                      <span className='text-sm font-medium'>
                        {application.matchScore.overall}%
                      </span>
                    </div>
                    <div className='flex gap-2 text-xs text-gray-500'>
                      <span>Skills: {application.matchScore.skills}%</span>
                      <span>•</span>
                      <span>Exp: {application.matchScore.experience}%</span>
                      <span>•</span>
                      <span>Edu: {application.matchScore.education}%</span>
                    </div>
                  </div>
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
                <TableCell>{application.location}</TableCell>
                <TableCell>{application.salary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
