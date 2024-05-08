import Image from "next/image";
import Menu from "./Menu";
import { createClient } from "../utils/supabase/server";

export default async function Navbar() {
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
    <nav className="w-full flex border-b border-b-foreground/10 h-20 fixed top-0 z-10 bg-white shadow-sm">
      <div>
        <Image src="/images/sathyameva-jayathe.png" height={80} width={80} alt="Sathyameva Jayathe" />
      </div>
      <div className=" self-center">
        <div className="font-semibold text-xl">Office of the SDO, EGRA</div>
        <div className="font-semibold text-base">Voter Sahayata Portal</div>
      </div>
      <Menu user={user} signOut={signOut} />
      {/* <div className="ml-auto max-w-4xl flex justify-between items-center py-3 px-4 text-sm">
      <AuthButton />
    </div> */}
    </nav>
  );
}
