"use client";
import { useEffect, useState } from "react";
import { Search, Calendar, Send, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export interface IJob {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  times_ago: string;
  tags?: string[];
}

export default function AvailableJobs() {
  const [activeTab, setActiveTab] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<IJob[]>([]);

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

  return (
    <div className='max-w-5xl mx-auto p-4 mt-4 space-y-4'>
      <div className='flex space-x-2'>
        <div className='relative flex-grow'>
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
          <Input className='pl-8' placeholder='Search jobs...' />
        </div>
        <Button variant='outline' className='flex items-center'>
          <Calendar className='mr-2 h-4 w-4' />
          Date Range
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-40'>
        <TabsList>
          <TabsTrigger value='latest'>Latest</TabsTrigger>
          <TabsTrigger value='popular'>Hot</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='space-y-4'>
        {jobs.map((job) => (
          <div
            key={job.id}
            className='relative flex cursor-pointer border-b border-zinc-100 bg-white p-5 hover:bg-zinc-50 max-md:flex-col max-md:space-y-4 md:p-8 rounded-lg shadow'
          >
            <div className='w-full flex items-start'>
              <Avatar className='h-10 w-10 mr-3'>
                {/* <img src={job.avatar} alt={job.company} /> */}
                <AvatarImage
                  src='https://github.com/shadcn.png'
                  alt='@shadcn'
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className='flex-grow'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h3 className='font-semibold text-lg'>{job.title}</h3>
                    <p className='text-sm text-gray-500'>{job.created_by}</p>
                  </div>
                  <div className='text-sm text-gray-500 text-right'>
                    <p>{job.times_ago}</p>
                    <p>{job.created_at} Published</p>
                  </div>
                </div>
                <div className='mt-2 flex justify-between items-center flex-wrap gap-2'>
                  <div>
                    {job.tags?.map((tag, index) => (
                      <Badge key={index} variant='secondary'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant={"outline"}>
                        <Eye /> Show
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
