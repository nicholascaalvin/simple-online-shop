import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@/components/ui/button";
import React from "react";

const Profile = () => {
  return (
    <div>
      <h1 className="text-6xl">Profile Page</h1>
      <Button variant="outline">Button</Button>
      <Link href={"/"}>
        <HomeIcon sx={{ fontSize: 50 }} />
      </Link>
    </div>
  );
};

export default Profile;
