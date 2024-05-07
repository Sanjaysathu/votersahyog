import { createClient } from "../../../utils/supabase/server";
import { NextResponse } from "next/server";

const isEmpty = (n) => {
  return !(n ? (typeof n === "object" ? (Array.isArray(n) ? !!n.length : !!Object.keys(n).length) : true) : false);
};

export async function GET(request, { params }) {
  const supabase = createClient();
  const url = new URL(request.url).searchParams;
  const booth_id = url.get("booth_id");
  const constituency_id = url.get("constituency_id");

  if (isNaN(booth_id) || isNaN(constituency_id)) {
    return NextResponse.json({ message: "Invalid polling station" }, { status: 400 });
  }

  if (isEmpty(constituency_id)) {
    return NextResponse.json({ message: "Constituency number is empty" }, { status: 400 });
  }

  if (isEmpty(booth_id)) {
    return NextResponse.json({ message: "Polling station number is empty" }, { status: 400 });
  }

  const { data: booth_history } = await supabase.from("booth-history").select("*").eq("booth_id", booth_id).eq("constituency_id", constituency_id);

  if ((booth_history || []).length > 0) {
    return NextResponse.json({ message: "Polling station history found", data: booth_history }, { status: 200 });
  }
  return NextResponse.json({ message: "Polling station data not found" }, { status: 400 });
}
