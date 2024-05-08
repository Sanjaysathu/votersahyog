import { createClient } from "@/utils/supabase/server";
import BoothDetailsFormComponent from "@/components/BoothDetailsForm";
import AuthButton from "@/components/AuthButton";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default async function BoothDetails() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  const { data: booth_details } = await supabase.from("booth-details").select("*").eq("booth_officer_email", user.email);
  //   console.log(booth_details);
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
      <BoothDetailsFormComponent booth_details={booth_details[0]} />
      <Footer />
    </>
  );
}
