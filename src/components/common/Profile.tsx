"use client";
import React from "react";
import type { MenuProps } from "antd";
import { Avatar, Button, Dropdown, Space } from "antd";
import { CircleUserRound } from "lucide-react";
// import { signIn, signOut } from "@/lib/auth"
import { signIn, signOut } from "next-auth/react";
import { useSession, SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';

const items: MenuProps["items"] = [
  {
    key: "MyProfile",
    label: "My Profile",
  },
  {
    key: "ChangePass",
    label: "Change Password",
  },
  {
    key: "SignOut",
    label: (
      <a
        onClick={(e) => {
          e.preventDefault();
          signOut({
            redirect: true,
            callbackUrl: '/auth/sign-in',
          });
        }}
      >
        Sign Out
      </a>
    ),
  },
];

const Profile: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/error');
  }

  return (
    // <Space
    //   direction='vertical'
    //   style={{ height: "56px" }}
    //   className='flex justify-center items-center space-x-1'
    // >
    <div className='flex justify-center items-center'>
      {/* <Space wrap> */}
      <Dropdown menu={{ items }} placement='bottom'>
        <Button size='large' type='text'>
          <div className='flex justify-center items-center space-x-1'>
            <CircleUserRound size={20} />
            {/* <Avatar
              src='https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg'
              alt='avatar'
            /> */}
            <span>{session.user?.name || 'User'}</span>
          </div>
        </Button>
      </Dropdown>
      {/* </Space> */}
      {/* </Space> */}
    </div>
  )
};

export default Profile;
