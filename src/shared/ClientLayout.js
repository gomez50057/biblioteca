"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/shared/Navbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/revision");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
