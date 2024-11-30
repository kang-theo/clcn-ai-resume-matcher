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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CommonSkeleton from "../common/Skeleton";
import toast from "react-hot-toast";
import axios from "@/lib/axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  applicants: string;
  tags: {
    name: string;
    color: string;
  }[];
  description: string;
  responsibilities: string[];
  overview: string;
  about: string;
  salary: string;
  times_ago: string;
}

export default function JobBoard() {
  const [salaryRange, setSalaryRange] = React.useState([50]);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // const jobs = [
  //   {
  //     id: 1,
  //     title: "Product designer",
  //     company: "MetaMask",
  //     logo: "",
  //     applicants: "25 Applicants",
  //     tags: [
  //       { name: "Entry Level", color: "bg-purple-100 text-purple-900" },
  //       { name: "Full-Time", color: "bg-green-100 text-green-900" },
  //       { name: "Remote", color: "bg-orange-100 text-orange-900" },
  //       { name: "UI/UX", color: "bg-blue-100 text-blue-900" },
  //       { name: "Enterprise", color: "bg-red-100 text-red-900" },
  //       { name: "SaaS", color: "bg-yellow-100 text-yellow-900" },
  //     ],
  //     description:
  //       "Doing the right thing for investors is what we're all about at Vanguard, and that in...",
  //     salary: "",
  //     postedTime: "12 days ago",
  //     responsibilities: [
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //     ],
  //     overview:
  //       "To reach millions, we need more people like you: entrepreneurs, builders, owners inside the company who are eager to grow at scale. Join us to empower more businesses with technology.",
  //     about:
  //       "Makro PRO is an exciting new digital venture by the iconic Makro. Our proud purpose is to build a technology platform that will help make business possible for restaurant owners, hotels, and independent retailers, and open the door for sellers. Makro PRO brings together the best talent across multi-nationals to transform",
  //   },
  //   {
  //     id: 2,
  //     title: "Sr. UX Designer",
  //     company: "Netflix",
  //     logo: "",
  //     applicants: "14 Applicants",
  //     tags: [
  //       { name: "Expert", color: "bg-purple-100 text-purple-900" },
  //       { name: "Part-Time", color: "bg-green-100 text-green-900" },
  //       { name: "Remote", color: "bg-orange-100 text-orange-900" },
  //     ],
  //     description:
  //       "Netflix is one of the world's leading streaming entertainment service with o...",
  //     salary: "$195",
  //     postedTime: "5 days ago",
  //     responsibilities: [
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //     ],
  //     overview:
  //       "To reach millions, we need more people like you: entrepreneurs, builders, owners inside the company who are eager to grow at scale. Join us to empower more businesses with technology.",
  //     about:
  //       "Makro PRO is an exciting new digital venture by the iconic Makro. Our proud purpose is to build a technology platform that will help make business possible for restaurant owners, hotels, and independent retailers, and open the door for sellers. Makro PRO brings together the best talent across multi-nationals to transform",
  //   },
  //   {
  //     id: 3,
  //     title: "Sr. UX Designer",
  //     company: "Netflix",
  //     logo: "",
  //     applicants: "14 Applicants",
  //     tags: [
  //       { name: "Expert", color: "bg-purple-100 text-purple-900" },
  //       { name: "Part-Time", color: "bg-green-100 text-green-900" },
  //       { name: "Remote", color: "bg-orange-100 text-orange-900" },
  //     ],
  //     description:
  //       "Netflix is one of the world's leading streaming entertainment service with o...",
  //     salary: "$195",
  //     postedTime: "5 days ago",
  //     responsibilities: [
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //       "Sitemap Analytics Sitemap Analytics. ask Sitemap Analytics Sitemap Analytics",
  //     ],
  //     overview:
  //       "To reach millions, we need more people like you: entrepreneurs, builders, owners inside the company who are eager to grow at scale. Join us to empower more businesses with technology.",
  //     about:
  //       "Makro PRO is an exciting new digital venture by the iconic Makro. Our proud purpose is to build a technology platform that will help make business possible for restaurant owners, hotels, and independent retailers, and open the door for sellers. Makro PRO brings together the best talent across multi-nationals to transform",
  //   },
  //   // Add more job listings as needed
  // ];

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/jobs");
      if (data.meta.code === "OK") {
        setJobs(data.result.records);
      } else {
        toast.error(data.meta.message || "Failed to get jobs");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message || "Failed to get jobs");
    }
  };

  const handleShowDetails = (job: Job) => {
    setSelectedJob(job);
    setSheetOpen(true);
  };

  return (
    <TooltipProvider>
      <div className='min-h-screen bg-slate-50'>
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
            <div className='w-full lg:w-64 space-y-6'>
              <div>
                <div className='flex items-center justify-between'>
                  <h2 className='font-semibold'>Job Type</h2>
                  <Button variant='link' className='text-blue-600'>
                    Clear all
                  </Button>
                </div>
                <div className='mt-4 space-y-3'>
                  {[
                    "Full time",
                    "Part time",
                    "Internship",
                    "Project work",
                    "Volunteering",
                  ].map((type) => (
                    <div key={type} className='flex items-center space-x-2'>
                      <Checkbox id={type} />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className='font-semibold'>Salary Range</h2>
                <div className='mt-4'>
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={120}
                    min={50}
                    step={1}
                    className='py-4'
                  />
                  <div className='flex justify-between text-sm'>
                    <span>${salaryRange}k</span>
                    <span>$120k</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className='font-semibold'>Experience Level</h2>
                <div className='mt-4 space-y-3'>
                  {[
                    { name: "Entry level", count: "392" },
                    { name: "Intermediate", count: "124" },
                    { name: "Expert", count: "3921" },
                  ].map((level) => (
                    <div
                      key={level.name}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center space-x-2'>
                        <Checkbox id={level.name} />
                        <Label htmlFor={level.name}>{level.name}</Label>
                      </div>
                      <span className='text-sm text-gray-500'>
                        {level.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
                          {job.logo ? (
                            <Image
                              src={job.logo}
                              alt={job.company}
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
                          )}

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
                              {job.company ?? "N/A"}
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
                        <div className='mt-auto flex items-center justify-between'>
                          {job.salary ? (
                            <div className='font-semibold'>{job.salary}/hr</div>
                          ) : (
                            <div></div>
                          )}
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-500'>
                              {job.times_ago}
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
            {selectedJob && (
              <div className='space-y-8'>
                <SheetHeader className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      {selectedJob.logo ? (
                        <Image
                          src={selectedJob.logo}
                          alt={selectedJob.company}
                          width={56}
                          height={56}
                          className='rounded-xl'
                        />
                      ) : (
                        <Building className='h-12 w-12' strokeWidth={1} />
                      )}

                      <SheetTitle className='text-2xl font-bold'>
                        {selectedJob.title}
                      </SheetTitle>
                    </div>
                    <div className='flex gap-2'>
                      <Button variant='outline' className='rounded-full'>
                        <Sparkles className='h-4 w-4' strokeWidth={1} />
                        Analysis
                      </Button>
                      <Button className='rounded-full'>
                        <Send className='h-4 w-4' strokeWidth={1} />
                        Apply Now
                      </Button>
                    </div>
                  </div>
                  <p className='text-gray-600'>{selectedJob.company}</p>
                </SheetHeader>

                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-xl font-semibold'>Job Overview</h2>
                      <Plus className='h-4 w-4' />
                    </div>
                    <p className='text-gray-600 leading-relaxed'>
                      {selectedJob.overview}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-xl font-semibold'>
                        What You Will Do
                      </h2>
                      <Plus className='h-4 w-4' />
                    </div>
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
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <h2 className='text-xl font-semibold'>
                          About {selectedJob.company}
                        </h2>
                        <Plus className='h-4 w-4' />
                      </div>
                      <Button variant='outline' className='rounded-full'>
                        Follow
                      </Button>
                    </div>
                    <p className='text-gray-600 leading-relaxed'>
                      {selectedJob.about}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
