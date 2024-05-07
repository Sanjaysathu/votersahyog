import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/AuthButton";
import { redirect } from "next/navigation";
import BoothHistory from "../../../components/BoothHistory";
import Footer from "@/components/Footer";
import BoothImages from "../../../components/BoothImages";

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
      {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav> */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="self-center font-semibold text-xl px-4">
          <a href="/">Voter Sahyog</a>
        </div>
        <div className="ml-auto max-w-4xl flex justify-between items-center py-3 px-4 text-sm">
          <AuthButton />
        </div>
      </nav>
      <BoothImages booth_details={booth_details[0]} />
      <Footer />
    </>
  );
}