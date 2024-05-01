"use client";
import { useState } from "react";
import Select from "react-select";
import { PATASHPUR_1_OPTIONS, PATASHPUR_2_OPTIONS } from "./constants/patashpur";
import { EGRA_1_OPTIONS, EGRA_2_OPTIONS } from "./constants/egra";
import { BHAGWANPUR_1_OPTIONS, BHAGWANPUR_2_OPTIONS, PATASHPUR_2_OPTIONS as BHAGWANPUR_3_OPTIONS } from "./constants/bhagwanpur";
import toast, { Toaster } from "react-hot-toast";

const CONSTITUENCIES_OPTIONS = ["212 Patashpur", "214 Bhagwanpur", "218 Egra"];

const BLOCK_NAME_OPTIONS = { "212 Patashpur": ["Patashpur-1", "Patashpur-2"], "214 Bhagwanpur": ["Bhagwanpur-1", "Bhagwanpur-2", "Patashpur-2"], "218 Egra": ["Egra-1", "Egra-2"] };

export default function DashboardComponent() {
  const [selectedConstituency, setConstituency] = useState("");
  const [selectedBlock, setBlock] = useState("");
  const [selectedPollingStation, setPollingStation] = useState("");
  const [liveCount, setLiveCount] = useState({});

  const getPollingStationOptions = () => {
    if (selectedConstituency === "212 Patashpur") {
      const pollingStationsMapping = { "Patashpur-1": PATASHPUR_1_OPTIONS, "Patashpur-2": PATASHPUR_2_OPTIONS };
      return pollingStationsMapping[selectedBlock];
    } else if (selectedConstituency === "214 Bhagwanpur") {
      const pollingStationsMapping = { "Bhagwanpur-1": BHAGWANPUR_1_OPTIONS, "Bhagwanpur-2": BHAGWANPUR_2_OPTIONS, "Patashpur-2": BHAGWANPUR_3_OPTIONS };
      return pollingStationsMapping[selectedBlock];
    } else if (selectedConstituency === "218 Egra") {
      const pollingStationsMapping = { "Egra-1": EGRA_1_OPTIONS, "Egra-1": EGRA_2_OPTIONS };
      return pollingStationsMapping[selectedBlock];
    }
    return [];
  };

  const fetchPollingStationDetails = async (booth_name) => {
    const booth_id = booth_name.split("-")[0]?.trim();
    const res = await fetch(`/api/booth-details/${booth_id}`, { method: "GET" });
    if (res.ok) {
      const res_json = await res.json();
      setLiveCount(res_json.data);
    } else {
      const res_json = await res.json();
      toast.error(res_json.message);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="flex justify-center mt-6 px-4">
        <div className="w-full md:w-2/6">
          <div>Select Constituency</div>
          <div className="mb-6">
            <Select
              isSearchable={false}
              options={CONSTITUENCIES_OPTIONS.map((el) => ({ label: el, value: el }))}
              value={{ label: selectedConstituency, value: selectedConstituency }}
              onChange={(e) => {
                setConstituency(e.value);
                setBlock("");
                setPollingStation("");
              }}
            />
          </div>
          {selectedConstituency ? (
            <>
              <div>Select Block</div>
              <div className="mb-6">
                <Select
                  isSearchable={false}
                  options={BLOCK_NAME_OPTIONS[selectedConstituency]?.map((el) => ({ label: el, value: el })) ?? ""}
                  value={{ label: selectedBlock, value: selectedBlock }}
                  onChange={(e) => {
                    setBlock(e.value);
                    setPollingStation("");
                  }}
                />
              </div>
            </>
          ) : null}

          {selectedBlock && selectedConstituency ? (
            <>
              <div>Select Polling Station</div>
              <div className="mb-6">
                <Select
                  options={getPollingStationOptions()?.map((el) => ({ label: el, value: el }))}
                  value={{ label: selectedPollingStation, value: selectedPollingStation }}
                  onChange={(e) => {
                    setPollingStation(e.value);
                    fetchPollingStationDetails(e.value);
                  }}
                />
              </div>
            </>
          ) : null}
          {Object.keys(liveCount).length > 0 && (
            <div>
              <div>Male persons in line</div>
              <div className="mb-6">{liveCount.male_count}</div>
              <div>Female persons in line</div>
              <div className="mb-6">{liveCount.female_count}</div>
              <div>Total persons in line</div>
              <div>{liveCount.male_count + liveCount.female_count}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
