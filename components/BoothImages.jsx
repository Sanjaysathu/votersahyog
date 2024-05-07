"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function BoothImages({ booth_details }) {
  const [state, setState] = useState({
    booth_picture_1: booth_details.booth_picture_1,
    booth_picture_2: booth_details.booth_picture_2,
    booth_picture_3: booth_details.booth_picture_3,
  });

  const updateBoothPictures = async (payload) => {
    const res = await fetch("/api/booth-pictures-update", { method: "POST", body: JSON.stringify({ ...payload }), headers: { "Content-Type": "application/json" } });
    if (res.ok) {
      const res_json = await res.json();
      toast.success("Booth picture updated successfully");
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
      setState((prevState) => ({ ...prevState, [e.target.name]: `https://mfyxvwjwekbbihjgapjr.supabase.co/storage/v1/object/public/booth-pictures${file_path}` }));
      console.log(data);
      updateBoothPictures({ [e.target.name]: `https://mfyxvwjwekbbihjgapjr.supabase.co/storage/v1/object/public/booth-pictures${file_path}` });
      // https://mfyxvwjwekbbihjgapjr.supabase.co/storage/v1/object/public/booth-pictures/challenge-5.svg
      // Handle success
    }
  };

  return (
    <div className="px-4 w-full mt-6 md:w-1/3 mb-20">
      <Toaster position="bottom-center" />
      <div className="mb-5 font-semibold text-lg">Booth pictures</div>
      <div className="font-medium mb-3">Picture 1</div>
      <div className="mb-6">
        {state.booth_picture_1 && (
          <a href={state.booth_picture_1} target="_blank" className="mb-3 block">
            <img src={state.booth_picture_1} height="200px" width={200} alt="booth picture" />
          </a>
        )}
        <input type="file" accept="image/*" name="booth_picture_1" onChange={handleFileUpload} className="w-full text-sm" />
      </div>
      <div className="font-medium mb-3">Picture 2</div>
      <div className="mb-6">
        {state.booth_picture_2 && (
          <a href={state.booth_picture_2} target="_blank" className="mb-3 block">
            <img src={state.booth_picture_2} height="200px" width={200} alt="booth picture" />
          </a>
        )}
        <input type="file" accept="image/*" name="booth_picture_2" onChange={handleFileUpload} className="w-full text-sm" />
      </div>
      <div className="font-medium mb-3">Picture 3</div>
      <div>
        {state.booth_picture_3 && (
          <a href={state.booth_picture_3} target="_blank" className="mb-3 block">
            <img src={state.booth_picture_3} height="200px" width={200} alt="booth picture" />
          </a>
        )}
        <input type="file" accept="image/*" name="booth_picture_3" onChange={handleFileUpload} className="w-full text-sm" />
      </div>
    </div>
  );
}
