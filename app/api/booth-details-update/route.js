import { createClient } from "../../../utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  const supabase = createClient();
  const requestBody = await request.json();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }

  const { data: booth_details } = await supabase.from("booth-details").select("*").eq("booth_officer_email", user.email);
  // console.log(sid);

  if ((booth_details || []).length > 0) {
    // console.log(Users);
    // const { error: boothError } = await supabase.from("booth-details").update(requestBody).eq("booth_officer_email", user.email).select();
    const { error: boothHistoryError } = await supabase.from("booth-history").insert([requestBody]).select();
    // const { data, error } = await supabase.from("booth-history").const { data, error } = await supabase.from("booth-details").update(requestBody).eq("booth_officer_email", user.email).select(); (requestBody).eq("booth_officer_email", user.email).select();
    if (boothHistoryError) {
      return NextResponse.json({ message: boothHistoryError.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Polling station details updated" }, { status: 200 });
  }
  return NextResponse.json({ message: "Polling station officer email not found" }, { status: 400 });
}
