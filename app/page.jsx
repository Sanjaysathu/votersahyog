import { redirect } from "next/navigation";
import AuthButton from "../components/AuthButton";
import DashboardComponent from "@/components/Dashboard";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="self-center font-semibold text-xl px-4">
          <a href="/">Voter Sahyog</a>
        </div>
        <div className="ml-auto max-w-4xl flex justify-between items-center py-3 px-4 text-sm">
          <AuthButton />
        </div>
      </nav>
      <DashboardComponent />
    </div>
  );
}
