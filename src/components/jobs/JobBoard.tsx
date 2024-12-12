"use client";

import * as React from "react";
import {
  Building,
  ChevronDown,
  Eye,
  Heart,
  MapPin,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Check,
  ChartNoAxesCombined,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CommonSkeleton from "../common/Skeleton";
import toast from "react-hot-toast";
import axios, { isCancel } from "@/lib/axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SalaryRangeFilter } from "./SalaryRangeFilter";
import { Icons } from "../common/Icons";
import { MatchAnalysisChart } from "./MatchAnalysisChart";

interface Job {
  id: number;
  title: string;
  company: {
    name: string;
    logo: string;
    about: string;
    size: string;
    industry: string;
    website?: string;
    location: string;
  };
  location: string;
  job_type: string; // "Full-time" | "Part-time" | "Contract"
  remote_policy: string; // "Remote" | "Hybrid" | "On-site"
  experience_level: string;
  salary_range: {
    min: number;
    max: number;
    currency: string;
    period: string; // "yearly" | "monthly" | "hourly"
  };
  description: string;
  required_skills: string | string[];
  preferred_skills?: string | string[];
  responsibilities: string | string[];
  benefits?: string[];
  skills: string[];
  posted_at: string;
  deadline?: string;
  applicants_count: number;
  tags: {
    name: string;
    color: string;
  }[];
}

interface OnlineResume {
  // ... other fields ...
  experiences: string | Experience[];
  technical_skills: string | TechnicalSkill[];
  soft_skills: string | SoftSkill[];
  education: string | Education[];
  job_preferences: string | JobPreferences;
  // ... other fields ...
}

interface Experience {
  company: string;
  position: string;
  department: string;
  location: string;
  employment_type: string;
  duration: {
    start: string;
    end: string | null;
    is_current: boolean;
  };
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

interface TechnicalSkill {
  skill: string;
  proficiency: string;
  years_experience: number;
  last_used: string;
}

interface SoftSkill {
  skill: string;
  context: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduation: string;
  gpa: number;
  honors: string[];
  relevant_courses: string[];
}

interface JobPreferences {
  desired_role_level: string[];
  preferred_industries: string[];
  job_types: string[];
  preferred_locations: string[];
  salary_expectations: {
    min: number;
    max: number;
    currency: string;
  };
  notice_period: string;
}

const fetchJobs = async (
  signal?: AbortSignal,
  params?: Record<string, any>
) => {
  try {
    const { data } = await axios.get("/api/jobs", {
      signal,
      params,
    });

    if (data.meta.code === "OK") {
      return data.result.records;
    } else {
      return [];
    }
  } catch (error: any) {
    if (!isCancel(error)) {
      throw error;
    }
  }
};

export default function JobBoard() {
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200]);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [requesting, setRequesting] = useState(false);
  const [analysisRes, setAnalysisRes] = useState<{
    analysisText: {
      skill_match_score: number;
      experience_match_score: number;
      education_match_score: number;
      overall_match_score: number;
      matching_skills: string[];
      missing_skills: string[];
      recommendations: string;
      analysis_summary: string;
    } | null;
  }>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchJobs(controller.signal)
      .then((data) => {
        if (!data) {
          // console.log("No data received from API");
          setJobs([]);
          return;
        }
        // console.log("Received jobs:", data); // Debug log
        setJobs(data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error); // Debug log
        toast.error(error.message || "Failed to get jobs");
        setJobs([]); // Set empty array on error
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const getJobDetails = async (jobId: number) => {
    setLoadingJobDetails(true);
    try {
      const { data } = await axios.get(`/api/jobs/${jobId}`);
      if (data.meta.code === "OK") {
        setSelectedJob(data.result);
      } else {
        toast.error(data.meta.message || "Failed to get job details");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to get job details");
      setSelectedJob(null);
    } finally {
      setLoadingJobDetails(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setRequesting(true);
      setAnalysisRes(null);
      const { data } = await axios.post(`/api/jobs/${selectedJob!.id}/analyze`);

      if (data.meta.code === "OK") {
        setAnalysisRes(data.result);
        toast.success("Job analyzed successfully");
      } else {
        toast.error(data.meta.message || "Failed to analyze job");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.meta.message || "Failed to analyze job"
      );
    } finally {
      setRequesting(false);
    }
  };

  const handleShowDetails = async (job: Job) => {
    setSheetOpen(true);
    await getJobDetails(job.id);
  };

  const JobFilterPanel = () => {
    return (
      <div className='w-full lg:w-64 space-y-6'>
        {/* Employment Type */}
        <FilterSection
          title='Employment Type'
          options={[
            { id: "full-time", label: "Full Time" },
            { id: "part-time", label: "Part Time" },
            { id: "contract", label: "Contract" },
            { id: "internship", label: "Internship" },
          ]}
        />

        {/* Work Location */}
        <FilterSection
          title='Work Location'
          options={[
            { id: "remote", label: "Remote" },
            { id: "hybrid", label: "Hybrid" },
            { id: "on-site", label: "On-site" },
          ]}
        />

        {/* Experience Level */}
        <FilterSection
          title='Experience Level'
          options={[
            { id: "entry", label: "Entry Level (0-2 years)" },
            { id: "mid", label: "Mid Level (3-5 years)" },
            { id: "senior", label: "Senior Level (5+ years)" },
            { id: "lead", label: "Lead/Manager" },
          ]}
        />

        {/* Salary Range */}
        <SalaryRangeFilter
          onChange={setSalaryRange}
          value={salaryRange}
          min={0}
          max={200}
          currency='USD'
        />

        {/* Industry Sector */}
        <FilterSection
          title='Industry'
          options={[
            { id: "tech", label: "Technology" },
            { id: "finance", label: "Finance" },
            { id: "healthcare", label: "Healthcare" },
            { id: "education", label: "Education" },
            { id: "retail", label: "Retail" },
          ]}
        />

        {/* Company Size */}
        <FilterSection
          title='Company Size'
          options={[
            { id: "startup", label: "Startup (<50)" },
            { id: "small", label: "Small (50-200)" },
            { id: "mid", label: "Mid-size (201-1000)" },
            { id: "enterprise", label: "Enterprise (1000+)" },
          ]}
        />

        {/* Skills */}
        {/* <div className='space-y-4'>
          <h2 className='font-semibold'>Skills</h2>
          <div className='flex flex-wrap gap-2'>
            <Badge variant='outline'>React</Badge>
            <Badge variant='outline'>Node.js</Badge>
            <Badge variant='outline'>Python</Badge>
            <Badge variant='outline'>AWS</Badge>
            <Badge variant='outline'>+ Add Skill</Badge>
          </div>
        </div> */}

        {/* Additional Filters */}
        {/* <FilterSection
          title='Additional Filters'
          options={[
            { id: "visa", label: "Visa Sponsorship" },
            { id: "urgent", label: "Urgent Hiring" },
            { id: "benefits", label: "Benefits Package" },
          ]}
        /> */}
      </div>
    );
  };

  // Reusable Filter Section Component
  const FilterSection = ({
    title,
    options,
  }: {
    title: string;
    options: { id: string; label: string }[];
  }) => {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold'>{title}</h2>
          <Button variant='ghost' size='sm'>
            Clear
          </Button>
        </div>
        <div className='space-y-3'>
          {options.map((option) => (
            <div key={option.id} className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Checkbox id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
              <span className='text-sm text-gray-500'>
                {/* Count can be added here */}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className='min-h-screen pb-6 bg-slate-50'>
        {/* Search Section */}
        <div className='bg-slate-50 p-6'>
          <div className='mx-auto max-w-6xl'>
            <div className='flex flex-col sm:flex-row gap-4 rounded-3xl sm:rounded-full bg-white p-4 shadow-sm'>
              <div className='flex flex-1 items-center gap-2 px-4'>
                <Search className='h-5 w-5 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Job title or keyword'
                  className='border-0 bg-transparent focus-visible:ring-0 shadow-none'
                />
              </div>
              {/* <div className='flex flex-1 items-center gap-2 border-l px-4'>
              <MapPin className='h-5 w-5 text-gray-400' />
              <Input
                type='text'
                placeholder='Add country or city'
                className='border-0 bg-transparent focus-visible:ring-0'
              />
            </div> */}
              <Button size='lg' className='rounded-full px-8 w-full sm:w-auto'>
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className='mx-auto max-w-6xl'>
          <div className='flex justify-between'>
            <h1 className='text-2xl font-semibold'>Recommended jobs</h1>
            <Button variant='outline' className='gap-2'>
              Most recent
              <ChevronDown className='h-4 w-4' />
            </Button>
          </div>

          <div className='mt-6 flex flex-col lg:flex-row gap-6'>
            {/* Filters */}
            <JobFilterPanel />

            {/* Job Listings */}
            {loading ? (
              <div className='flex-1'>
                <CommonSkeleton />
              </div>
            ) : (
              <div className='flex-1'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {jobs.map((job) => (
                    <Card
                      key={job.id}
                      className='group relative overflow-hidden'
                    >
                      <CardContent className='p-6 flex flex-col h-[300px]'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 opacity-0 transition-opacity group-hover:opacity-100'
                        >
                          <Heart className='h-4 w-4' />
                        </Button>
                        <div className='flex items-start gap-2 mb-4'>
                          <div>
                            <Building
                              className='h-[40px] w-[40px]'
                              strokeWidth={1}
                            />
                          </div>
                          {/* {job.company.logo ? (
                            <Image
                              src={job.company.logo}
                              alt={job.company.name}
                              className='rounded-lg'
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div>
                              <Building
                                className='h-[40px] w-[40px]'
                                strokeWidth={1}
                              />
                            </div>
                          )} */}

                          <div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <h3 className='font-semibold truncate max-w-[200px]'>
                                  {job.title}
                                </h3>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{job.title}</p>
                              </TooltipContent>
                            </Tooltip>
                            <p className='text-sm text-gray-500'>
                              {/* {job.company ?? 'N/A'} • {job.applicants ?? "0 applicants"} */}
                              {job.company.name ?? "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className='mb-4 h-[50px] overflow-hidden'>
                          <div className='flex flex-wrap gap-2'>
                            {job.tags.map((tag, index) => (
                              <React.Fragment key={tag.name}>
                                {index < 4 && (
                                  <span
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tag.color}`}
                                  >
                                    {tag.name}
                                  </span>
                                )}
                                {index === 4 && (
                                  <span className='rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800'>
                                    +{job.tags.length - 4} more
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        <p className='flex-grow mb-4 line-clamp-3 text-sm text-gray-600 overflow-hidden'>
                          {job.description}
                        </p>
                        <div className='mt-auto space-y-1'>
                          {job.salary_range && (
                            <div className='text-sm text-gray-900 font-medium'>
                              {job.salary_range.min.toLocaleString()} -{" "}
                              {job.salary_range.max.toLocaleString()}{" "}
                              {job.salary_range.currency}/
                              {job.salary_range.period?.slice(0, 2) ?? "yr"}
                            </div>
                          )}
                          <div className='flex items-center justify-between'>
                            <span className='text-xs text-gray-500'>
                              {job.posted_at}
                            </span>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='gap-2'
                              onClick={() => handleShowDetails(job)}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Details Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className='w-full sm:max-w-3xl overflow-y-auto pt-10'>
            {loadingJobDetails ? (
              <div className='space-y-4'>
                <CommonSkeleton />
              </div>
            ) : selectedJob ? (
              <div className='space-y-8'>
                {/* Header */}
                <SheetHeader className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <Building className='h-12 w-12' strokeWidth={1} />
                      {/* {selectedJob.company.logo ? (
                        <Image
                          src={selectedJob.company.logo}
                          alt={selectedJob.company.name}
                          width={56}
                          height={56}
                          className='rounded-xl'
                        />
                      ) : (
                        <Building className='h-12 w-12' strokeWidth={1} />
                      )} */}
                      <div>
                        <SheetTitle className='text-2xl font-bold'>
                          {selectedJob.title}
                        </SheetTitle>
                        <p className='text-gray-600'>
                          {selectedJob.company.name}
                        </p>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        className='rounded-full gap-2'
                        onClick={handleAnalyze}
                      >
                        {requesting ? (
                          <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <>
                            <ChartNoAxesCombined className='h-4 w-4' /> Analyze
                          </>
                        )}
                      </Button>
                      <Button className='rounded-full gap-2'>
                        <Send className='h-4 w-4' strokeWidth={1} />
                        Apply Now
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className='flex flex-wrap gap-2'>
                    {selectedJob.tags.map((tag) => (
                      <span
                        key={tag.name}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tag.color}`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  {/* Quick Info */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg'>
                    <div>
                      <p className='text-sm text-gray-500'>Experience</p>
                      <p className='font-medium'>
                        {selectedJob.experience_level}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Work Type</p>
                      <p className='font-medium'>{selectedJob.job_type}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Location Type</p>
                      <p className='font-medium'>{selectedJob.remote_policy}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Location</p>
                      <p className='font-medium'>{selectedJob.location}</p>
                    </div>
                    <div className='md:col-span-2'>
                      <p className='text-sm text-gray-500'>Salary Range</p>
                      <p className='font-medium'>
                        {selectedJob.salary_range.min.toLocaleString()} -{" "}
                        {selectedJob.salary_range.max.toLocaleString()}{" "}
                        {selectedJob.salary_range.currency}/
                        {selectedJob.salary_range.period?.slice(0, 2) ?? "yr"}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                <div className='space-y-6'>
                  {/* Description */}
                  <section className='space-y-4'>
                    <h2 className='text-xl font-semibold'>About the Role</h2>
                    <p className='text-gray-600 leading-relaxed'>
                      {selectedJob.description}
                    </p>
                  </section>

                  {/* Key Responsibilities */}
                  <section className='space-y-4'>
                    <h2 className='text-xl font-semibold'>
                      Key Responsibilities
                    </h2>
                    {Array.isArray(selectedJob.responsibilities) ? (
                      <ul className='space-y-3'>
                        {selectedJob.responsibilities.map((item, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <div className='mt-1.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center'>
                              <svg
                                className='h-2.5 w-2.5 text-green-600'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M5 13l4 4L19 7'
                                />
                              </svg>
                            </div>
                            <span className='text-gray-600'>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-gray-600 leading-relaxed'>
                        {selectedJob.responsibilities}
                      </p>
                    )}
                  </section>

                  {/* Skills */}
                  <section className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Skills</h2>
                    <div className='space-y-4'>
                      <div>
                        <h3 className='font-medium mb-2'>Required Skills</h3>
                        <ul className='space-y-2'>
                          {(typeof selectedJob.required_skills === "string"
                            ? JSON.parse(selectedJob.required_skills)
                            : selectedJob.required_skills
                          ).map((skill: string, index: number) => (
                            <li key={index} className='flex items-start gap-2'>
                              <span className='text-gray-600'>• {skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {selectedJob.preferred_skills && (
                        <div>
                          <h3 className='font-medium mb-2'>Preferred Skills</h3>
                          <ul className='space-y-2'>
                            {(typeof selectedJob.preferred_skills === "string"
                              ? JSON.parse(selectedJob.preferred_skills)
                              : selectedJob.preferred_skills
                            ).map((skill: string, index: number) => (
                              <li
                                key={index}
                                className='flex items-start gap-2'
                              >
                                <span className='text-gray-600'>• {skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Benefits if available */}
                  {selectedJob.benefits && (
                    <section className='space-y-4'>
                      <h2 className='text-xl font-semibold'>Benefits</h2>
                      <ul className='grid grid-cols-2 gap-3'>
                        {selectedJob.benefits.map((benefit, index) => (
                          <li key={index} className='flex items-center gap-2'>
                            <Check className='h-4 w-4 text-green-500' />
                            <span className='text-gray-600'>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Company Info */}
                  <section className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-xl font-semibold'>
                        About {selectedJob.company.name}
                      </h2>
                      <Button variant='outline' className='rounded-full gap-2'>
                        <Building className='h-4 w-4' />
                        View Company
                      </Button>
                    </div>
                    <div className='space-y-4'>
                      <p className='text-gray-600 leading-relaxed'>
                        {selectedJob.company.about}
                      </p>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <p className='text-sm text-gray-500'>Industry</p>
                          <p className='font-medium'>
                            {selectedJob.company.industry}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500'>Company size</p>
                          <p className='font-medium'>
                            {selectedJob.company.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {analysisRes && (
                    <section className='space-y-4'>
                      <h2 className='text-xl font-semibold'>Match Analysis</h2>
                      <MatchAnalysisChart data={analysisRes.analysisText!} />
                    </section>
                  )}
                </div>
              </div>
            ) : (
              <div className='text-center text-gray-500'>
                Failed to load job details
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
