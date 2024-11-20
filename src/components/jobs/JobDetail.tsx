"use client";

import {
  ArrowLeft,
  ChartNoAxesCombined,
  Clock,
  Send,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { IJob } from "./AvailableJobs";
import toast from "react-hot-toast";
import CommonSkeleton from "@/components/common/Skeleton";
import DOMPurify from "dompurify";
import { Icons } from "../common/Icons";
import Link from "next/link";

interface IProps {
  id: string;
}

export default function JobDetail({ id }: IProps) {
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<IJob | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [analysisRes, setAnalysisRes] = useState<string>("");

  useEffect(() => {
    getJob();
  }, []);

  const getJob = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/jobs/${id}`);
      if (data.meta.code === "OK") {
        setJob(data.result);
      } else {
        toast.error(data.meta.message || "Failed to get job");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message || "Failed to get job");
    }
  };

  const handleAnalyze = async () => {
    try {
      setRequesting(true);
      setAnalysisRes("");
      const { data } = await axios.post(`/api/jobs/${id}/analyze`);
      if (data.meta.code === "OK") {
        setAnalysisRes(data.result.analysisText);
        toast.success("Job analyzed successfully");
      } else {
        toast.error(data.meta.message || "Failed to analyze job");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to analyze job");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4 max-w-4xl'>
        <CommonSkeleton />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      {/* Header */}
      <header className='flex justify-between items-center mb-6'>
        <div className='flex items-center gap-2'>
          <Link href='/jobs'>
            <Button variant='ghost'>
              <ArrowLeft className='h-4 w-4' /> Back
            </Button>
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant={"outline"} onClick={handleAnalyze}>
            {requesting ? (
              <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <>
                <ChartNoAxesCombined className='h-4 w-4' /> Analyze
              </>
            )}
          </Button>
          <Button className='bg-[#0F172A] text-white hover:bg-[#1E293B]'>
            <Send className='h-4 w-4' /> Apply
          </Button>
        </div>
      </header>

      {analysisRes && (
        <Card className='mb-6'>
          <CardContent className='space-y-6'>{analysisRes}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className='space-y-4'>
          {/* Post info */}
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            {/* <Badge variant='secondary'>TBD</Badge> */}
            <div className='flex items-center gap-1'>
              <User className='h-4 w-4' />
              {job?.created_by}
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='h-4 w-4' />
              {job?.times_ago} | {job?.created_at} published
            </div>
          </div>

          {/* Title and tags */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>{job?.title}</h2>
            <div className='flex gap-2 flex-wrap'>
              <Badge variant='outline'>Tag1</Badge>
              <Badge variant='outline'>Tag2</Badge>
              <Badge variant='outline'>Tag3</Badge>
              <Badge variant='outline'>Tag4</Badge>
              <Badge variant='outline'>Tag5</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div
            className='prose max-w-none dark:text-white'
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(job?.description!),
            }}
          ></div>
        </CardContent>
      </Card>
    </div>
  );
}
