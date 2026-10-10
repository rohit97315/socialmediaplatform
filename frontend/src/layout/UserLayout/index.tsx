import NavbarComponent from "@/components/Navbar";
import React from "react";

export default function UserLayout({children}: { children: React.ReactNode }) {
  return (
    <div>
      <NavbarComponent/>
      {children}
    </div>
  )
}
