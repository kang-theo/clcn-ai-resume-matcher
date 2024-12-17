"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Check, X, Send, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ApplicationsListProps {
  status: "pending" | "approved" | "rejected";
}

interface Application {
  id: string;
  status: string;
  job_description: {
    title: string;
    company: {
      name: string;
      location: string;
    };
    created_at: string;
    salary_range?: {
      currency: string;
      min: number;
      max: number;
    };
  };
  job_match?: {
    overall_match_score: number;
    skill_match_score: number;
    experience_match_score: number;
    education_match_score: number;
  };
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function ApplicationsList({ status }: ApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  const fetchApplications = async (pageNumber: number) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/applications", {
        params: {
          status,
          page: pageNumber,
        },
      });

      setApplications(data.result.records);
      setTotalPages(data.result.total);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(page);
  }, [page, status]);

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      await axios.patch(`/api/applications/${applicationId}`, {
        status: newStatus,
      });
      // Refresh the applications list
      fetchApplications(page);
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const handleSendInterview = async (applicationId: string) => {
    try {
      await axios.post(`/api/applications/${applicationId}/send-interview`);
      // Show success message or handle response
    } catch (error) {
      console.error("Failed to send interview:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h1 className='text-2xl font-bold capitalize'>{status} Applications</h1>
        <div className='w-full sm:w-auto'>
          <Input
            placeholder='Search jobs...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full sm:w-64'
          />
        </div>
      </div>

      {/* Mobile View (< 768px) */}
      {!isTablet && (
        <div className='space-y-4'>
          {applications.map((application) => (
            <Card key={application.id} className='p-4'>
              <div className='space-y-2'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='font-medium'>
                      {application.job_description.title}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {application.job_description.company.name}
                    </p>
                  </div>
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
                </div>

                <div className='text-sm text-gray-500'>
                  <p>{application.job_description.company.location}</p>
                  <p>
                    Applied:{" "}
                    {new Date(
                      application.job_description.created_at
                    ).toLocaleDateString()}
                  </p>
                  {application.job_description.salary_range && (
                    <p>
                      Salary:{" "}
                      {application.job_description.salary_range.currency}
                      {Math.floor(
                        application.job_description.salary_range.min / 1000
                      )}
                      K -
                      {Math.floor(
                        application.job_description.salary_range.max / 1000
                      )}
                      K
                    </p>
                  )}
                </div>

                {application.job_match && (
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
                  </div>
                )}

                {application.status !== "rejected" && (
                  <div className='flex justify-end pt-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        {application.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(application.id, "approved")
                              }
                              className='text-green-600 hover:text-green-700 hover:bg-green-50'
                            >
                              <Check className='mr-2 h-4 w-4' />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(application.id, "rejected")
                              }
                              className='text-red-600 hover:text-red-700 hover:bg-red-50'
                            >
                              <X className='mr-2 h-4 w-4' />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {application.status === "approved" && (
                          <DropdownMenuItem
                            onClick={() => handleSendInterview(application.id)}
                            className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                          >
                            <Send className='mr-2 h-4 w-4' />
                            Send Interview
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table View (≥ 768px) */}
      {isTablet && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                {isDesktop && <TableHead>Applied Date</TableHead>}
                {isDesktop && <TableHead>Match Score</TableHead>}
                <TableHead>Status</TableHead>
                {isDesktop && <TableHead>Location</TableHead>}
                {isDesktop && <TableHead>Salary Range</TableHead>}
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id} className='hover:bg-gray-50'>
                  <TableCell className='font-medium'>
                    {application.job_description.title}
                  </TableCell>
                  <TableCell>
                    {application.job_description.company.name}
                    {!isDesktop && (
                      <div className='text-sm text-gray-500 mt-1'>
                        {application.job_description.company.location}
                      </div>
                    )}
                  </TableCell>
                  {isDesktop && (
                    <TableCell>
                      {new Date(
                        application.job_description.created_at
                      ).toLocaleDateString()}
                    </TableCell>
                  )}
                  {isDesktop && (
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
                                    application.job_match.overall_match_score >=
                                    80
                                      ? "#22c55e"
                                      : application.job_match
                                          .overall_match_score >= 70
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
                              Exp:{" "}
                              {application.job_match.experience_match_score}%
                            </span>
                            <span>•</span>
                            <span>
                              Edu: {application.job_match.education_match_score}
                              %
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className='text-gray-400'>No match data</span>
                      )}
                    </TableCell>
                  )}
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
                  {isDesktop && (
                    <TableCell>
                      {application.job_description.company.location}
                    </TableCell>
                  )}
                  {isDesktop && (
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
                  )}
                  <TableCell>
                    {application.status !== "rejected" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          {application.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(application.id, "approved")
                                }
                                className='text-green-600 hover:text-green-700 hover:bg-green-50'
                              >
                                <Check className='mr-2 h-4 w-4' />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(application.id, "rejected")
                                }
                                className='text-red-600 hover:text-red-700 hover:bg-red-50'
                              >
                                <X className='mr-2 h-4 w-4' />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {application.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleSendInterview(application.id)
                              }
                              className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                            >
                              <Send className='mr-2 h-4 w-4' />
                              Send Interview
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination - Make it responsive */}
          <div className='mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 p-4'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='px-4 py-2 border rounded disabled:opacity-50 w-full sm:w-auto'
            >
              Previous
            </button>
            <span className='px-4 py-2'>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='px-4 py-2 border rounded disabled:opacity-50 w-full sm:w-auto'
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
