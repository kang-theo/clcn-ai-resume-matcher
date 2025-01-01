"use client";
import CommonSkeleton from "@/components/common/Skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Edit, FileText, Briefcase, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icons } from "@/components/common/Icons";
import { Badge } from "@/components/ui/badge";

// This type represents the structure of a resume
type Resume = {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  headline: string;
  current_status: string;
  location: string;
  relocation: boolean;
  remote_preference: string;
  experiences: Array<any>;
  technical_skills: {
    skill: string;
  }[];
  soft_skills: {
    skill: string;
  }[];
  education: Array<any>;
  certifications: Array<any>;
  job_preferences: any;
  projects: Array<any>;
  languages: string[];
  ai_analysis: any;
  visibility: string;
  completeness: number;
  last_updated: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function OnlineResumesList() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    title?: string;
    message: string;
    handler: () => void;
    onCancel?: () => void;
  } | null>(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    getResumes();
  }, []);

  const getResumes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/online-resumes");
      if (data.meta.code === "OK") {
        setResumes(data.result.records);
      } else {
        toast.error(data.meta.message || "Failed to get resumes");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message || "Failed to get resumes");
    }
  };

  const handleDeleteResume = (rid: string) => {
    setConfirmDialog({
      title: "Delete Resume",
      message:
        "Are you sure you want to delete this resume? The operation will delete related data.",
      handler: () => deleteResume(rid),
    });
    setConfirmDialogVisible(true);
  };

  const deleteResume = async (rid: string) => {
    setRequesting(true);
    try {
      const { data } = await axios.delete(`/api/online-resumes/${rid}`);
      if (data.meta.code === "OK") {
        toast.success("Resume deleted successfully");
        getResumes();
      } else {
        toast.error(data.meta.message || "Failed to delete resume");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to delete resume");
    }
  };

  if (loading) {
    return <CommonSkeleton />;
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>My Resumes</h1>
        <Link href='/settings/resumes/new'>
          <Button>New Resume</Button>
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {resumes.map((resume) => (
          <Card key={resume.id} className='flex flex-col'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <FileText className='mr-2' />
                {resume.title || "Untitled Resume"}
              </CardTitle>
              <CardDescription className='space-y-1'>
                <p>
                  Updated: {new Date(resume.last_updated).toLocaleDateString()}
                </p>
                <p>Completeness: {resume.completeness}%</p>
                <p>Visibility: {resume.visibility}</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* Primary Info Section */}
                <div className='flex items-start gap-3 border-b pb-3'>
                  <div className='flex-1 space-y-2'>
                    <p className='flex items-center text-sm font-medium'>
                      <Briefcase className='mr-2 h-4 w-4 text-muted-foreground' />
                      {resume.headline || "No headline"}
                    </p>
                    <div className='grid gap-1.5 text-sm text-muted-foreground'>
                      <p>Status: {resume.current_status}</p>
                      <p className='flex items-center gap-1'>
                        Location: {resume.location}
                        {resume.relocation && (
                          <span className='text-green-600'>
                            (Open to relocation)
                          </span>
                        )}
                      </p>
                      <p>Work Type: {resume.remote_preference}</p>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <p className='text-sm font-medium mb-2'>Skills:</p>
                  <div className='flex flex-wrap gap-1.5'>
                    {(resume.technical_skills || [])
                      .slice(0, 3)
                      .map(({ skill }, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='px-2 py-0.5 text-xs font-medium'
                        >
                          {skill}
                        </Badge>
                      ))}
                    {(resume.technical_skills || []).length > 3 && (
                      <Button
                        variant='ghost'
                        className='h-5 text-xs px-2 hover:bg-secondary/80'
                        title='View all skills'
                      >
                        +{resume.technical_skills.length - 3} more
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='mt-auto flex gap-2'>
              <Link href={`/settings/resumes/${resume.id}`} className='flex-1'>
                <Button variant='ghost' className='w-full'>
                  <Edit className='mr-2 h-4 w-4' />
                </Button>
              </Link>
              <Button
                variant='ghost'
                className='flex-1 text-destructive hover:text-destructive'
                onClick={() => handleDeleteResume(resume.id)}
              >
                <Trash2 className='mr-2 h-4 w-4' />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <AlertDialog
        open={confirmDialogVisible}
        onOpenChange={setConfirmDialogVisible}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog?.title ?? "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={confirmDialog?.onCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog?.handler}>
              {requesting ? (
                <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
