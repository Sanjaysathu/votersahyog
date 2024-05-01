import { createClient } from "../../../../utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const supabase = createClient();
  const { booth_id } = params;
  if (isNaN(booth_id)) {
    return NextResponse.json({ message: "Invalid polling station" }, { status: 400 });
  }

  const { data: booth_details } = await supabase.from("booth-details").select("male_count,female_count,booth_name,booth_id").eq("booth_id", booth_id);

  if (booth_details.length > 0) {
    return NextResponse.json({ message: "Polling station details found", data: booth_details[0] }, { status: 200 });
  }
  return NextResponse.json({ message: "Polling station data not found" }, { status: 400 });
}
