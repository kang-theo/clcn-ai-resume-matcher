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
import { Edit, FileText, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  if (loading) {
    return <CommonSkeleton />;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>My Resumes</h1>
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
              <p>Experience: {resume.content?.experience}</p>
            </CardContent>
            <CardFooter className='mt-auto'>
              <Button variant='outline' className='mr-2'>
                <Edit className='mr-2 h-4 w-4' /> Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
