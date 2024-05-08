import { redirect } from "next/navigation";
import AuthButton from "../components/AuthButton";
import DashboardComponent from "@/components/Dashboard";
import Menu from "@/components/Menu";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  return (
    <div className="flex-1 w-full flex-col gap-20 items-center pt-20">
      {/* <nav className="w-full flex border-b border-b-foreground/10 h-20 fixed top-0 z-10 bg-white shadow-sm">
        <div>
          <Image src="/images/sathyameva-jayathe.png" height={80} width={80} alt="Sathyameva Jayathe" />
        </div>
        <div className=" self-center">
          <div className="font-semibold text-xl">Office of the SDO, EGRA</div>
          <div className="font-semibold text-base">Voter Sahayata Portal</div>
        </div>
        <Menu user={user} signOut={signOut} />
      </nav> */}
      <Navbar />
      <DashboardComponent />
    </div>
  );
}
