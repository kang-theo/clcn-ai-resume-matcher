"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeEditor } from "@/components/common/Editor";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast from "react-hot-toast";
import { Icons } from "@/components/common/Icons";
import { Separator } from "@/components/ui/separator";

const fieldsMap: Record<string, string> = {
  name: "Full name",
  email: "Email",
  phone: "Phone",
  experienceYears: "Experience (years)",
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
};

interface IProps {
  id?: string;
}

export default function Resume({ id }: IProps) {
  const [requesting, setRequesting] = useState(false);
  const [resume, setResume] = useState({
    title: "",
    jobTitle: "",
    name: "",
    email: "",
    phone: "",
    experienceYears: 0,
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getResume(id);
    }
  }, [id]);

  const getResume = async (rid: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/online-resumes/${rid}`);
      if (data.meta.code === "OK") {
        setResume(data.result.content);
      } else {
        toast.error(data.meta.message || "Failed to get resume");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message || "Failed to get resume");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, [name]: value }));
  };

  // we could use react-hook-form to refactor here but I think it's overkill for this simple form
  const handleSaveOnlineResume = () => {
    let hasError = false;
    for (const [key, value] of Object.entries(resume)) {
      if (!value) {
        hasError = true;
        toast.error(`Please fill in ${fieldsMap[key]} field`);
        break;
      }
    }

    if (!hasError) {
      setRequesting(true);
      if (id) {
        axios
          .put(`/api/online-resumes/${id}`, resume)
          .then(({ data }) => {
            if (data.meta.code === "OK") {
              toast.success("Save online resume successfully");
            } else {
              toast.error(
                data.meta.message ?? "Failed to save online resume.",
                {
                  position: "top-right",
                }
              );
            }
          })
          .catch((error) => {
            toast.error(
              error.response.data.message ??
                "An error occurred while saving online resume.",
              {
                position: "top-right",
              }
            );
          })
          .finally(() => setRequesting(false));
      } else {
        axios
          .post("/api/online-resumes", resume)
          .then(({ data }) => {
            if (data.meta.code === "OK") {
              toast.success("Save online resume successfully");
            } else {
              toast.error(
                data.meta.message ?? "Failed to save online resume.",
                {
                  position: "top-right",
                }
              );
            }
          })
          .catch((error) => {
            toast.error(
              error.response.data.message ??
                "An error occurred while saving online resume.",
              {
                position: "top-right",
              }
            );
          })
          .finally(() => setRequesting(false));
      }
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader className='flex  flex-row justify-between items-center'>
            <CardTitle>{id ? "Edit Resume" : "Build Your Resume"}</CardTitle>
            <Button variant={"secondary"} onClick={handleSaveOnlineResume}>
              {requesting ? (
                <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                "Save"
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <form>
              <div className='flex flex-col justify-between space-y-2'>
                <div className='space-y-2'>
                  <Label htmlFor='summary'>Title</Label>
                  <Input
                    name='title'
                    placeholder='Title'
                    value={resume.title}
                    onChange={handleChange}
                    className='mb-4'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='summary'>Job Title</Label>
                  <Input
                    name='jobTitle'
                    placeholder='Please input your job title'
                    value={resume.jobTitle}
                    onChange={handleChange}
                    className='mb-4'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='summary'>Full name</Label>
                  <Input
                    name='name'
                    placeholder='Full Name'
                    value={resume.name}
                    onChange={handleChange}
                    className='mb-4'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='summary'>Email</Label>
                  <Input
                    name='email'
                    placeholder='Email'
                    type='email'
                    value={resume.email}
                    onChange={handleChange}
                    className='mb-4'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='summary'>Phone number</Label>
                  <Input
                    name='phone'
                    placeholder='Phone'
                    type='tel'
                    value={resume.phone}
                    onChange={handleChange}
                    className='mb-4'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='summary'>Experience(years)</Label>
                  <Input
                    name='experienceYears'
                    placeholder='Experience (years)'
                    type='number'
                    value={resume.experienceYears}
                    min={0}
                    onChange={handleChange}
                    className='mb-4'
                  />
                </div>
                {/* <Textarea
                  name='summary'
                  placeholder='Professional Summary'
                  value={resume.summary}
                  onChange={handleChange}
                  className='mb-4'
                /> */}
                <div className='space-y-2'>
                  <Label htmlFor='summary'>Professional Summary</Label>
                  <ResumeEditor
                    title='Professional Summary'
                    fetching={false}
                    url={`/api/resumes/new`}
                    value={""}
                    saveType='json'
                    onSave={(content: string) => console.log({ content })}
                    // onComplete={() => noteModal.destroy()}
                    onChange={(content: any) =>
                      setResume({ ...resume, summary: content })
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='experience'>Work Experience</Label>
                  <ResumeEditor
                    title='Work Experience'
                    fetching={false}
                    url={`/api/resumes/new`}
                    value={resume.experience ?? ""}
                    saveType='json'
                    onSave={(content: string) => console.log({ content })}
                    // onComplete={() => noteModal.destroy()}
                    onChange={(content: any) =>
                      setResume({ ...resume, experience: content })
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='education'>Education</Label>
                  <ResumeEditor
                    title='Education'
                    fetching={false}
                    url={`/api/resumes/new`}
                    value={resume.education ?? ""}
                    saveType='json'
                    onSave={(content: string) => console.log({ content })}
                    // onComplete={() => noteModal.destroy()}
                    onChange={(content: any) =>
                      setResume({ ...resume, education: content })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='skills'>Skills</Label>
                  <ResumeEditor
                    title='Skills'
                    fetching={false}
                    url={`/api/resumes/new`}
                    value={resume.skills ?? ""}
                    saveType='json'
                    onSave={(content: string) => console.log({ content })}
                    // onComplete={() => noteModal.destroy()}
                    onChange={(content: any) =>
                      setResume({ ...resume, skills: content })
                    }
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resume Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className='text-2xl font-bold mb-2'>{resume.title}</h2>
            <Separator className='mb-4' />
            <h3 className='text-xl font-bold mb-2'>{resume.jobTitle}</h3>
            {/* <Separator className='mb-4' /> */}
            <h3 className='text-xl font-bold mb-2'>{resume.name}</h3>
            <p className='mb-2'>
              {resume.email} | {resume.phone}
            </p>
            <p className='mb-2'>
              <span>Experience: </span>
              <span>{resume.experienceYears} years</span>
            </p>
            <h3 className='text-xl font-semibold mb-2'>Summary</h3>
            <div className='mb-4'>
              <ResumeEditor
                title='Summary'
                fetching={false}
                value={resume.summary}
                saveType='html'
                headless
                // onComplete={() => noteModal.destroy()}
              />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Experience</h3>
            <div className='mb-4'>
              <ResumeEditor
                title=''
                fetching={false}
                value={resume.experience}
                saveType='html'
                headless
                // onComplete={() => noteModal.destroy()}
              />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Education</h3>
            <div className='mb-4'>
              {" "}
              <ResumeEditor
                title=''
                fetching={false}
                value={resume.education}
                saveType='html'
                headless
                // onComplete={() => noteModal.destroy()}
              />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Skills</h3>
            <div>
              <ResumeEditor
                title=''
                fetching={false}
                value={resume.skills}
                saveType='html'
                headless
                // onComplete={() => noteModal.destroy()}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
