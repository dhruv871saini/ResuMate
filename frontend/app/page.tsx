"use client";
import { useStore } from "@/store/useStore";
import LandingPage from "@/components/landing/LandingPage";
import AppShell from "@/components/layout/AppShell";

export default function Home() {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  return isLoggedIn ? <AppShell /> : <LandingPage />;
}
