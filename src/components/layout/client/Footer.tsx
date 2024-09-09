import { BookA } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer id='footer'>
      <hr className='w-11/12 mx-auto' />

      <section className='container text-right py-20 grid  grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8'>
        <div className='col-span-full xl:col-span-2'>
          <a
            rel='noreferrer noopener'
            href='/'
            className='font-bold text-xl flex items-center'
          >
            <BookA />
            ARM
          </a>
        </div>

        <div className='flex flex-col gap-2'></div>
        <div className='flex flex-col gap-2'></div>
        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-lg'>Social Links</h3>
          <div>
            <a
              rel='noreferrer noopener'
              href='#'
              className='opacity-60 hover:opacity-100'
            >
              Github
            </a>
          </div>

          <div>
            <a
              rel='noreferrer noopener'
              href='#'
              className='opacity-60 hover:opacity-100'
            >
              Twitter
            </a>
          </div>

          <div>
            <a
              rel='noreferrer noopener'
              href='#'
              className='opacity-60 hover:opacity-100'
            >
              Dribbble
            </a>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-lg'>Device</h3>
          <div>
            <a
              rel='noreferrer noopener'
              href='#'
              className='opacity-60 hover:opacity-100'
            >
              Web
            </a>
          </div>

          <div>
            <a
              rel='noreferrer noopener'
              href='#'
              className='opacity-60 hover:opacity-100'
            >
              Mobile
            </a>
          </div>

          <div>
            <a
              rel='noreferrer noopener'
              href='#'
              className='opacity-60 hover:opacity-100'
            >
              Desktop
            </a>
          </div>
        </div>
      </section>

      <Separator className='my-2' />
      <section className='container py-6 flex items-center justify-between'>
        <h3>
          &copy; 2024{" "}
          <span className='text-primary transition-all'>
            ARM. All rights reserved.
          </span>
        </h3>
        <div>
          <Link href='/privacy'>Privacy policy</Link>
        </div>
      </section>
    </footer>
  );
};
