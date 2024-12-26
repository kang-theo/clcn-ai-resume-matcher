"use client";
import Editor from "@/components/common/Editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const companySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  about: z.string().min(10, "Please provide company description"),
  size: z.enum([
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5000+",
  ]),
  industry: z.string().min(2, "Industry is required"),
  website: z.string().url("Please enter valid website URL"),
  location: z.string().min(2, "Location is required"),
});

const jobSchema = z.object({
  // Core Details
  title: z.string().min(3).max(100),
  company: companySchema,
  department: z.string().optional(),
  job_type: z.enum(["full-time", "part-time", "contract"]),
  experience_level: z.enum(["entry", "mid", "senior"]),
  salary_range: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
      currency: z.string(),
    })
    .optional(),

  // Rich Text Fields
  description: z.string().min(10),
  responsibilities: z.string().min(10),
  qualifications: z.string().min(10),
  technical_requirements: z.string().optional(),
  benefits: z.string().optional(),

  // Arrays/JSON
  required_skills: z
    .array(z.string())
    .min(1, "At least one required skill is needed"),
  preferred_skills: z.array(z.string()).optional(),

  // Additional Fields
  remote_policy: z.enum(["Remote", "Hybrid", "On-site"]),
  // visa_sponsorship: z.boolean().default(false),
  skills: z.string().min(1, "At least one skill is required"),
  industry_sector: z.string(),
  cultural_keywords: z.array(z.string()).optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export function JobForm() {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      // visa_sponsorship: false,
      required_skills: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/admin/jobs", data);
      if (response.data.meta.code === "OK") {
        toast.success("Job created successfully");
      } else {
        toast.error(response.data.meta.message);
      }
    } catch (error: any) {
      console.error("Failed to create job:", error);
      toast.error(error.response.data.meta.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this to show validation errors
  const onError = (errors: any) => {
    console.log("Form errors:", errors);
  };

  return (
    <Form {...form}>
      <div className='relative'>
        <AnimatePresence>
          {isSubmitting && (
            <LoadingOverlay
              message='Creating job posting...'
              submessage='This may take a few moments'
            />
          )}
        </AnimatePresence>
        <motion.form
          animate={{ opacity: isSubmitting ? 0.6 : 1 }}
          transition={{ duration: 0.2 }}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className='space-y-6'
          style={{
            pointerEvents: isSubmitting ? "none" : "auto",
          }}
        >
          {/* Core Details */}
          <Card>
            <CardHeader>
              <CardTitle>Core Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Senior Software Engineer'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='company.name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='company.website'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='https://company.com' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='company.about'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Company</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Brief description of your company...'
                        className='h-24'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='job_type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select job type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='full-time'>Full Time</SelectItem>
                          <SelectItem value='part-time'>Part Time</SelectItem>
                          <SelectItem value='contract'>Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='experience_level'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select level' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='entry'>Entry Level</SelectItem>
                          <SelectItem value='mid'>Mid Level</SelectItem>
                          <SelectItem value='senior'>Senior Level</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='company.size'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select company size' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='1-10'>1-10 employees</SelectItem>
                          <SelectItem value='11-50'>11-50 employees</SelectItem>
                          <SelectItem value='51-200'>
                            51-200 employees
                          </SelectItem>
                          <SelectItem value='201-500'>
                            201-500 employees
                          </SelectItem>
                          <SelectItem value='501-1000'>
                            501-1000 employees
                          </SelectItem>
                          <SelectItem value='1001-5000'>
                            1001-5000 employees
                          </SelectItem>
                          <SelectItem value='5000+'>5000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='company.industry'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select industry' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='technology'>Technology</SelectItem>
                          <SelectItem value='finance'>Finance</SelectItem>
                          <SelectItem value='healthcare'>Healthcare</SelectItem>
                          <SelectItem value='education'>Education</SelectItem>
                          <SelectItem value='retail'>Retail</SelectItem>
                          {/* Add more industries as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='company.location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='e.g. San Francisco, CA' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Rich Text Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Editor
                        title='Job Description'
                        fetching={false}
                        url=''
                        value={field.value}
                        saveType='json'
                        onSave={(content: string) => console.log({ content })}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name='responsibilities'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsibilities</FormLabel>
                    <FormControl>
                      <Editor
                        title='Responsibilities'
                        fetching={false}
                        url=''
                        value={field.value}
                        saveType='json'
                        onSave={(content: string) => console.log({ content })}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name='technical_requirements'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Requirements (Optional)</FormLabel>
                    <FormControl>
                      <Editor
                        title='Technical Requirements'
                        fetching={false}
                        url=''
                        value={field.value ?? ""}
                        saveType='json'
                        onSave={(content: string) => console.log({ content })}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name='qualifications'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <Editor
                        title='Qualifications'
                        fetching={false}
                        url=''
                        value={field.value}
                        saveType='json'
                        onSave={(content: string) => console.log({ content })}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name='skills'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills Overview</FormLabel>
                    <FormControl>
                      <Editor
                        title='Skills'
                        fetching={false}
                        url=''
                        value={field.value}
                        saveType='json'
                        onSave={(content: string) => console.log({ content })}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Requirements</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='required_skills'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills</FormLabel>
                      <FormControl>
                        <div className='space-y-2'>
                          <Input
                            placeholder='Add skill and press Enter'
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                const skill = input.value.trim();
                                if (skill && !field.value.includes(skill)) {
                                  field.onChange([...field.value, skill]);
                                  input.value = "";
                                }
                              }
                            }}
                          />
                          <div className='flex flex-wrap gap-2'>
                            {field.value.map((skill, index) => (
                              <Badge key={index} variant='secondary'>
                                {skill}
                                <button
                                  type='button'
                                  onClick={() => {
                                    field.onChange(
                                      field.value.filter((_, i) => i !== index)
                                    );
                                  }}
                                  className='ml-1 hover:text-destructive'
                                >
                                  <X className='h-3 w-3' />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='preferred_skills'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Skills</FormLabel>
                      <FormControl>
                        <div className='space-y-2'>
                          <Input
                            placeholder='Add preferred skill'
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                const skill = input.value.trim();
                                if (skill && !field.value?.includes(skill)) {
                                  field.onChange([
                                    ...(field.value || []),
                                    skill,
                                  ]);
                                  input.value = "";
                                }
                              }
                            }}
                          />
                          <div className='flex flex-wrap gap-2'>
                            {field.value?.map((skill, index) => (
                              <Badge key={index} variant='outline'>
                                {skill}
                                <button
                                  type='button'
                                  onClick={() => {
                                    field.onChange(
                                      field.value?.filter((_, i) => i !== index)
                                    );
                                  }}
                                  className='ml-1 hover:text-destructive'
                                >
                                  <X className='h-3 w-3' />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex gap-4'>
                  <FormField
                    control={form.control}
                    name='salary_range.min'
                    render={({ field }) => (
                      <FormItem className='w-1/2'>
                        <FormLabel>Minimum Salary</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='salary_range.max'
                    render={({ field }) => (
                      <FormItem className='w-1/2'>
                        <FormLabel>Maximum Salary</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='salary_range.currency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select currency' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='USD'>USD</SelectItem>
                          <SelectItem value='EUR'>EUR</SelectItem>
                          <SelectItem value='GBP'>GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='remote_policy'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remote Policy</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select remote policy' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Remote'>Remote</SelectItem>
                          <SelectItem value='Hybrid'>Hybrid</SelectItem>
                          <SelectItem value='On-site'>On-site</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='industry_sector'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Sector</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select industry sector' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Technology'>Technology</SelectItem>
                          <SelectItem value='Healthcare'>Healthcare</SelectItem>
                          <SelectItem value='Finance'>Finance</SelectItem>
                          <SelectItem value='Education'>Education</SelectItem>
                          <SelectItem value='Manufacturing'>
                            Manufacturing
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className='flex items-center justify-center'>
            <Button type='submit' className='w-1/4' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Submitting...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </Form>
  );
}
