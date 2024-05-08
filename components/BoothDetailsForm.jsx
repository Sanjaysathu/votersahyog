"use client";
import { SubmitButton } from "@/app/login/submit-button";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import Select from "react-select";

const isValidNumber = (value) => {
  return /^\d+$/.test(value?.trim());
};

export default function BoothDetailsFormComponent({ booth_details }) {
  const [state, setState] = useState({
    entry_time: new Date().toLocaleTimeString().slice(0, -3),
    male_count: booth_details.male_count || "",
    female_count: booth_details.female_count || "",
    booth_id: booth_details.booth_id,
    constituency_id: booth_details.constituency_id,
    booth_image: "",
  });

  const updateBoothDetails = async () => {
    const res = await fetch("/api/booth-details-update", { method: "PATCH", body: JSON.stringify({ ...state }), headers: { "Content-Type": "application/json" } });
    if (res.ok) {
      const res_json = await res.json();
      toast.success(res_json.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const supabase = createClient();
    const file_path = `/${Date.now().toString()}-${file.name}`;
    const { data, error } = await supabase.storage.from("booth-pictures").upload(file_path, file);
    if (error) {
      // Handle error
    } else {
      setState((prevState) => ({ ...prevState, booth_image: `https://mfyxvwjwekbbihjgapjr.supabase.co/storage/v1/object/public/booth-pictures${file_path}` }));
      // https://mfyxvwjwekbbihjgapjr.supabase.co/storage/v1/object/public/booth-pictures/challenge-5.svg
      // Handle success
    }
  };

  return (
    <div className="mt-6 w-full px-4 md:w-1/3 mb-20 pt-20">
      <Toaster position="bottom-center" />
      <form>
        <div className="mb-6">
          <div className="text-md font-medium">Constituency</div>
          <div>
            {booth_details.constituency_id} - {booth_details.constituency}
          </div>
          {/* <Select value={{ label: booth_details.constituency, value: booth_details.constituency }} instanceId="constituency" /> */}
        </div>
        <div className="mb-6">
          <div className="text-md font-medium">Block</div>
          <div>{booth_details.block_name}</div>
          {/* <Select value={{ label: booth_details.block_name, value: booth_details.block_name }} instanceId="block" /> */}
        </div>
        <div className="mb-6">
          <div className="text-md font-medium">Polling station</div>
          <div>
            {booth_details.booth_id} - {booth_details.booth_name}
          </div>
          {/* <Select value={{ label: booth_details.booth_name, value: booth_details.booth_name }} instanceId="booth name" /> */}
        </div>
        <div>
          <label className="text-md font-medium" htmlFor="time">
            Time of entry
          </label>
          <div>
            <input
              onClick={(e) => e.target.showPicker()}
              className="rounded-md px-4 py-2 bg-inherit border mb-6 cursor-pointer"
              type="time"
              name="time"
              value={state.entry_time}
              onChange={(e) => setState((prevState) => ({ ...prevState, entry_time: e.target.value }))}
              pattern="hh:mm"
              disabled
              required
            />
          </div>
        </div>
        <div>
          <label className="text-md font-medium" htmlFor="male_count">
            Number of male persons in queue
          </label>
          <div>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="male_count"
              type="text"
              inputMode="numeric"
              value={state.male_count}
              onChange={(e) => {
                let value = e.target.value;
                value = !value || isValidNumber(value) ? (value ? Number(value) : value) : state.male_count;
                setState((prevState) => ({ ...prevState, male_count: value }));
              }}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-md font-medium" htmlFor="female_count">
            Number of female persons in queue
          </label>
          <div>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="female_count"
              type="text"
              inputMode="numeric"
              value={state.female_count}
              onChange={(e) => {
                const value = e.target.value;
                !value || isValidNumber(value) ? (value ? Number(value) : value) : state.female_count;
                setState((prevState) => ({ ...prevState, female_count: e.target.value }));
              }}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-md font-medium">Total number of persons in queue</label>
          <div>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6 cursor-not-allowed read-only:bg-gray-200"
              type="text"
              value={(Number(state.female_count) || 0) + (Number(state.male_count) || 0)}
              readOnly
            />
          </div>
        </div>
        <div className="mb-6">
          <div className="text-md font-medium mb-2">Picture of the queue</div>
          {state.booth_image && (
            <a href={state.booth_image} target="_blank" className="mb-3 block">
              <img src={state.booth_image} height="200px" width={200} alt="booth image" />
            </a>
          )}
          <input type="file" accept="image/*" required onChange={handleFileUpload} className="w-full" />
        </div>
        <div className="mb-10">
          <SubmitButton formAction={updateBoothDetails} className="bg-black rounded-md px-10 py-2 text-white mb-2" pendingText="Submitting...">
            Submit
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
