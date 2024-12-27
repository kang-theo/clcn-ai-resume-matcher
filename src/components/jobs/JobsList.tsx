"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import CommonSkeleton from "../common/Skeleton";

enum JobStatus {
  Draft = "Draft",
  Open = "Open",
  Closed = "Closed",
}

interface Job {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
  };
  department?: string;
  location?: string;
  job_type?: string;
  status: JobStatus;
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  created_at: string;
  updated_at: string;
  description: string;
  required_skills: string[];
  preferred_skills?: string[];
  technical_requirements?: string;
  responsibilities: string;
  qualifications: string;
  benefits?: string;
  experience_level?: string;
  remote_policy?: "Remote" | "Hybrid" | "On-site";
  visa_sponsorship?: boolean;
  industry_sector?: string;
  company_size?: string;
  role_level?: "Junior" | "Mid" | "Senior" | "Lead";
  cultural_keywords?: string[];
  applicantsCount?: number;
}

interface JobsListProps {
  status: "all" | "Draft" | "Open" | "Closed";
}

export function JobsList({ status }: JobsListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "title",
      header: "Job Title",
    },
    {
      accessorKey: "company.name",
      header: "Company",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "job_type",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "Open"
                ? "default"
                : status === "Draft"
                ? "secondary"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "salary_range",
      header: "Salary Range",
      cell: ({ row }) => {
        const salary = row.getValue("salary_range") as Job["salary_range"];
        return salary
          ? `${
              salary.currency
            } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`
          : "-";
      },
    },
    {
      accessorKey: "applicantsCount",
      header: "Applicants",
    },
    {
      accessorKey: "created_at",
      header: "Created Date",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return date ? new Date(date).toLocaleDateString() : "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => handleEdit(job.id)}
                className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              >
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              {job.status !== "Closed" && (
                <DropdownMenuItem
                  onClick={() => handleClose(job.id)}
                  className='text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                >
                  <X className='mr-2 h-4 w-4' />
                  Close
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleDelete(job.id)}
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchJobs = async (pageNumber: number) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/jobs", {
        params: {
          status,
          page: pageNumber,
          search,
        },
      });

      setJobs(data.result.records);
      setTotalPages(Math.ceil(data.result.total / data.result.pageSize));
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (jobId: string) => {
    try {
      // Navigate to edit page or open modal
      window.location.href = `/jobs/edit/${jobId}`;
    } catch (error) {
      console.error("Failed to edit job:", error);
    }
  };

  const handleClose = async (jobId: string) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, {
        status: "closed",
      });
      fetchJobs(page);
    } catch (error) {
      console.error("Failed to close job:", error);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`/api/jobs/${jobId}`);
      fetchJobs(page);
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page, status, search]);

  if (loading) {
    return <CommonSkeleton />;
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h1 className='text-2xl font-bold capitalize'>{status} Jobs</h1>
        <div className='w-full sm:w-auto flex gap-4'>
          <Input
            placeholder='Search jobs...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full sm:w-64'
          />
          <Button onClick={() => router.push("/jobs/new")}>Create Job</Button>
        </div>
      </div>

      <DataTable columns={columns} data={jobs} />

      {/* Pagination */}
      <div className='mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 p-4'>
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          variant='outline'
          className='w-full sm:w-auto'
        >
          Previous
        </Button>
        <span className='px-4 py-2'>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          variant='outline'
          className='w-full sm:w-auto'
        >
          Next
        </Button>
      </div>
    </div>
  );
}
