import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/AuthButton";
import { redirect } from "next/navigation";
import BoothHistory from "../../../components/BoothHistory";
import Footer from "@/components/Footer";
import BoothImages from "../../../components/BoothImages";
import Navbar from "@/components/Navbar";

export default async function BoothHistoryComponent() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: booth_details } = await supabase.from("booth-details").select("*").eq("booth_officer_email", user.email);
  if (booth_details.length === 0) {
    return redirect("/login");
  }

  return (
    <>
      {/* <nav className="w-full flex border-b border-b-foreground/10 h-20 fixed top-0 z-10 bg-white shadow-sm">
        <div>
          <Image src="/images/sathyameva-jayathe.png" priority={true} height={80} width={80} alt="Sathyameva Jayathe" />
        </div>
        <div className=" self-center">
          <div className="font-semibold text-xl">Office of the SDO, EGRA</div>
          <div className="font-semibold text-base">Voter Sahayata Portal</div>
        </div>
        <Menu user={user} signOut={signOut} />
        
      </nav> */}
      <Navbar />
      <BoothImages booth_details={booth_details[0]} />
      <Footer />
    </>
  );
}
