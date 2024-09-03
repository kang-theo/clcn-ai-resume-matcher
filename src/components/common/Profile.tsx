"use client";
import React from "react";
import type { MenuProps } from "antd";
import { Avatar, Button, Dropdown, Space } from "antd";
import { CircleUserRound } from "lucide-react";

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
    key: "Logout",
    label: "Logout",
  },
];

const Profile: React.FC = () => (
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
          <span>Henry</span>
        </div>
      </Button>
    </Dropdown>
    {/* </Space> */}
    {/* </Space> */}
  </div>
);

export default Profile;
