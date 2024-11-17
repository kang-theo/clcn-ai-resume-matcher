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

// This type represents the structure of a resume
type Resume = {
  id: string;
  content: any;
  created_at: string;
  updated_at: string;
  // id: string;
  // title: string;
  // lastUpdated: string;
  // jobTitle: string;
  // experience: string;
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
                {resume.content?.title}
              </CardTitle>
              <CardDescription>
                Last updated: {resume.updated_at}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='flex items-center'>
                <Briefcase className='mr-2' />
                {resume.content?.jobTitle}
              </p>
              <p>Experience: {resume.content?.experienceYears} years</p>
            </CardContent>
            <CardFooter className='mt-auto'>
              <Link href={`/settings/resumes/${resume.id}`}>
                <Button variant='outline' className='mr-2'>
                  <Edit className='mr-2 h-4 w-4' /> Edit
                </Button>
              </Link>
              <Button
                className='text-red-500'
                variant='outline'
                onClick={() => handleDeleteResume(resume.id)}
              >
                <Trash2 /> Delete
              </Button>
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
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
