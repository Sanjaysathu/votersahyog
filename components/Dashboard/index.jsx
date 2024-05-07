"use client";
import { useState } from "react";
import Select from "react-select";
import { PATASHPUR_1_OPTIONS, PATASHPUR_2_OPTIONS, PATASHPUR_1_MAP_OPTIONS, PATASHPUR_2_MAP_OPTIONS } from "./constants/patashpur";
import { EGRA_1_MAP_OPTIONS, EGRA_1_OPTIONS, EGRA_2_MAP_OPTIONS, EGRA_2_OPTIONS, EGRA_MUNICIPALITY_MAP_OPTIONS, EGRA_MUNICIPALITY_OPTIONS } from "./constants/egra";
import { BHAGWANPUR_1_OPTIONS, BHAGWANPUR_2_OPTIONS, BHAGWANPUR_1_MAP_OPTIONS, BHAGWANPUR_2_MAP_OPTIONS } from "./constants/bhagwanpur";
import toast, { Toaster } from "react-hot-toast";

const PARLIAMENTARY_OPTIONS = ["31-Kanthi", "34-Medinipur"];

const ASSEMBLY_OPTIONS = { "31-Kanthi": ["212 Patashpur", "214 Bhagwanpur"], "34-Medinipur": ["218 Egra"] };

const BLOCK_NAME_OPTIONS = {
  "212 Patashpur": ["Patashpur-1", "Patashpur-2"],
  "214 Bhagwanpur": ["Bhagwanpur-1", "Bhagwanpur-2"],
  "218 Egra": ["Egra-1", "Egra-2", "Egra Municipality"],
};

export default function DashboardComponent() {
  const [selectedParliament, setParliament] = useState("");
  const [selectedConstituency, setConstituency] = useState("");
  const [selectedBlock, setBlock] = useState("");
  const [selectedPollingStation, setPollingStation] = useState("");
  const [liveCount, setLiveCount] = useState({});
  const [boothPictures, setBoothPictures] = useState({});

  const getPollingStationOptions = () => {
    if (selectedConstituency === "212 Patashpur") {
      const pollingStationsMapping = { "Patashpur-1": PATASHPUR_1_OPTIONS, "Patashpur-2": PATASHPUR_2_OPTIONS };
      return pollingStationsMapping[selectedBlock];
    } else if (selectedConstituency === "214 Bhagwanpur") {
      const pollingStationsMapping = { "Bhagwanpur-1": BHAGWANPUR_1_OPTIONS, "Bhagwanpur-2": BHAGWANPUR_2_OPTIONS };
      return pollingStationsMapping[selectedBlock];
    } else if (selectedConstituency === "218 Egra") {
      const pollingStationsMapping = { "Egra-1": EGRA_1_OPTIONS, "Egra-2": EGRA_2_OPTIONS, "Egra Municipality": EGRA_MUNICIPALITY_OPTIONS };
      return pollingStationsMapping[selectedBlock];
    }
    return [];
  };

  const getPollingLocation = () => {
    if (selectedConstituency === "212 Patashpur") {
      const pollingStationsMapsMapping = { "Patashpur-1": PATASHPUR_1_MAP_OPTIONS, "Patashpur-2": PATASHPUR_2_MAP_OPTIONS };
      const pollingStationsMapping = { "Patashpur-1": PATASHPUR_1_OPTIONS, "Patashpur-2": PATASHPUR_2_OPTIONS };
      const location = pollingStationsMapsMapping[selectedBlock][pollingStationsMapping[selectedBlock].findIndex((el) => el === selectedPollingStation)];
      return location;
    } else if (selectedConstituency === "214 Bhagwanpur") {
      const pollingStationsMapsMapping = { "Bhagwanpur-1": BHAGWANPUR_1_MAP_OPTIONS, "Bhagwanpur-2": BHAGWANPUR_2_MAP_OPTIONS };
      const pollingStationsMapping = { "Bhagwanpur-1": BHAGWANPUR_1_OPTIONS, "Bhagwanpur-2": BHAGWANPUR_2_OPTIONS };
      const location = pollingStationsMapsMapping[selectedBlock][pollingStationsMapping[selectedBlock].findIndex((el) => el === selectedPollingStation)];
      return location;
    } else if (selectedConstituency === "218 Egra") {
      const pollingStationsMapsMapping = { "Egra-1": EGRA_1_MAP_OPTIONS, "Egra-2": EGRA_2_MAP_OPTIONS, "Egra Municipality": EGRA_MUNICIPALITY_MAP_OPTIONS };
      const pollingStationsMapping = { "Egra-1": EGRA_1_OPTIONS, "Egra-2": EGRA_2_OPTIONS, "Egra Municipality": EGRA_MUNICIPALITY_OPTIONS };
      const location = pollingStationsMapsMapping[selectedBlock][pollingStationsMapping[selectedBlock].findIndex((el) => el === selectedPollingStation)];
      return location;
    }
    return null;
  };

  const fetchPollingStationDetails = async (booth_name) => {
    const booth_id = booth_name.split("-")[0]?.trim();
    const constituency_id = selectedConstituency.split(" ")[0]?.trim();
    const booth_history_res = await fetch(`/api/booth-history?booth_id=${booth_id}&constituency_id=${constituency_id}`, { method: "GET" });
    const booth_details_res = await fetch(`/api/booth-details?booth_id=${booth_id}&constituency_id=${constituency_id}`, { method: "GET" });
    if (booth_history_res.ok) {
      const res_json = await booth_history_res.json();
      setLiveCount(res_json.data.at(-1) || {});
    } else {
      setLiveCount({});
      const res_json = await booth_history_res.json();
      toast.error(res_json.message);
    }
    if (booth_details_res.ok) {
      const res_json = await booth_details_res.json();
      setBoothPictures(res_json.data);
    } else {
      setBoothPictures({});
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="flex justify-center mt-6 mb-10 px-4 text-sm">
        <div className="w-full md:w-2/6">
          <div className="font-medium">Parliamentary Constituency</div>
          <div className="mb-6">
            <Select
              isSearchable={false}
              options={PARLIAMENTARY_OPTIONS.map((el) => ({ label: el, value: el }))}
              value={{ label: selectedParliament, value: selectedParliament }}
              onChange={(e) => {
                setParliament(e.value);
                setConstituency("");
                setBlock("");
                setPollingStation("");
              }}
            />
          </div>
          <div className="font-medium">Assembly Constituency</div>
          <div className="mb-6">
            <Select
              isSearchable={false}
              options={ASSEMBLY_OPTIONS[selectedParliament]?.map((el) => ({ label: el, value: el }))}
              value={{ label: selectedConstituency, value: selectedConstituency }}
              onChange={(e) => {
                setConstituency(e.value);
                setBlock("");
                setPollingStation("");
              }}
            />
          </div>
          <div className="font-medium">Block</div>
          <div className="mb-6">
            <Select
              isSearchable={false}
              options={BLOCK_NAME_OPTIONS[selectedConstituency]?.map((el) => ({ label: el, value: el }))}
              value={{ label: selectedBlock, value: selectedBlock }}
              onChange={(e) => {
                setBlock(e.value);
                setPollingStation("");
              }}
            />
          </div>
          <div className="font-medium">Polling Station</div>
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
          {Object.keys(liveCount).length > 0 && (
            <div>
              <div className="font-medium">Entry time</div>
              <div className="mb-6">{liveCount.entry_time?.slice(0, -3)}</div>
              <div className="font-medium">Male persons in line</div>
              <div className="mb-6">{liveCount.male_count}</div>
              <div className="font-medium">Female persons in line</div>
              <div className="mb-6">{liveCount.female_count}</div>
              <div className="font-medium">Total persons in line</div>
              <div className="mb-6">{liveCount.male_count + liveCount.female_count}</div>
              {getPollingLocation() && (
                <a className="mb-6 block text-blue-700" href={getPollingLocation()} target="_blank">
                  View on map
                </a>
              )}
            </div>
          )}
          {Object.keys(boothPictures).length > 0 && (
            <div>
              <div className="mb-3 font-medium">Booth pictures</div>
              {boothPictures.booth_picture_1 && (
                <a href={boothPictures.booth_picture_1} target="_blank" className="block mb-3">
                  <img src={boothPictures.booth_picture_1} />
                </a>
              )}
              {boothPictures.booth_picture_2 && (
                <a href={boothPictures.booth_picture_2} target="_blank" className="block mb-3">
                  <img src={boothPictures.booth_picture_2} />
                </a>
              )}
              {boothPictures.booth_picture_3 && (
                <a href={boothPictures.booth_picture_3} target="_blank" className="block mb-3">
                  <img src={boothPictures.booth_picture_3} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
