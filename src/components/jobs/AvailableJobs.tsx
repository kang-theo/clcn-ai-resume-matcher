"use client";
import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const jobListings = [
  {
    id: 1,
    company: "V2EX",
    avatar: "/placeholder.svg?height=40&width=40",
    poster: "DoubleKingflyxq",
    title: "全职iOS 开发 IM项目",
    tags: ["全职", "14-18k", "5 年", "大专"],
    time: "2 小时前",
    date: "10/23 14:23",
  },
  {
    id: 2,
    company: "V2EX",
    avatar: "/placeholder.svg?height=40&width=40",
    poster: "otorainotarain",
    title: "全职Ruby On Rails 全栈工程师招聘",
    tags: [
      "全职",
      "线下",
      "深圳·南山前海",
      "15k ~ 20k",
      "2 年",
      "英文（读写）",
    ],
    time: "2 小时前",
    date: "10/23 14:09",
  },
  {
    id: 3,
    company: "电鸭",
    avatar: "/placeholder.svg?height=40&width=40",
    poster: "cl",
    title: "[远程] 招聘 Rust 开发和 React 开发（支持实习）",
    tags: ["远程", "其他", "开发", "企业直招"],
    time: "2 小时前",
    date: "10/23 14:04",
  },
];

export default function AvailableJobs() {
  const [activeTab, setActiveTab] = useState("latest");

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
        {jobListings.map((job) => (
          <div
            key={job.id}
            className='relative flex cursor-pointer border-b border-zinc-100 bg-white p-5 hover:bg-zinc-50 max-md:flex-col max-md:space-y-4 md:p-8 rounded-lg shadow'
          >
            <div className='flex items-start'>
              <Avatar className='h-10 w-10 mr-3'>
                {/* <img src={job.avatar} alt={job.company} /> */}
                <AvatarImage
                  src='https://github.com/shadcn.png'
                  alt='@shadcn'
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className='flex-grow'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='font-semibold text-lg'>{job.title}</h3>
                    <p className='text-sm text-gray-500'>{job.poster}</p>
                  </div>
                  <div className='text-sm text-gray-500'>
                    <p>{job.time}</p>
                    <p>{job.date} 发布</p>
                  </div>
                </div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
