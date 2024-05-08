import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/AuthButton";
import { redirect } from "next/navigation";
import BoothHistory from "../../../components/BoothHistory";
import Footer from "@/components/Footer";
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
  const { data: booth_history } = await supabase
    .from("booth-history")
    .select("*")
    .eq("booth_id", booth_details[0].booth_id)
    .eq("constituency_id", booth_details[0].constituency_id);

  if (booth_details.length === 0) {
    return redirect("/login");
  }

  return (
    <>
      {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="self-center font-semibold text-xl px-4">
          <a href="/">Voter Sahyog</a>
        </div>
        <div className="ml-auto max-w-4xl flex justify-between items-center py-3 px-4 text-sm">
          <AuthButton />
        </div>
      </nav> */}
      <Navbar />
      <BoothHistory booth_history={booth_history} />
      <Footer />
    </>
  );
}
