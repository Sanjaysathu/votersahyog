"use client";
import { useState } from "react";
import Select from "react-select";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";

// import { PATASHPUR_1_OPTIONS, PATASHPUR_2_OPTIONS, PATASHPUR_MAPS_MAPPING } from "./constants/patashpur";
// import { EGRA_1_OPTIONS, EGRA_2_OPTIONS, EGRA_MAPS_MAPPING, EGRA_MUNICIPALITY_OPTIONS } from "./constants/egra";
// import {  BHAGWANPUR_MAPS_MAPPING } from "./constants/bhagwanpur";

import Loader from "../Loader";
const LineGraph = dynamic(() => import("./graph"), { loading: () => <Loader /> });

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
  const [boothPictures, setBoothPictures] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [pollingStationOptions, setPollingStationOptions] = useState(null);
  const [pollingStationLocation, setPollingStationLocation] = useState("");

  const getPollingStationOptions = async (constituency, block) => {
    let options = [];
    if (constituency === "212 Patashpur") {
      const { PATASHPUR_1_OPTIONS, PATASHPUR_2_OPTIONS } = await import("./constants/patashpur");
      const pollingStationsMapping = { "Patashpur-1": PATASHPUR_1_OPTIONS, "Patashpur-2": PATASHPUR_2_OPTIONS };
      options = block ? pollingStationsMapping[block] : [...PATASHPUR_1_OPTIONS, ...PATASHPUR_2_OPTIONS];
      setPollingStationOptions(options);
    } else if (constituency === "214 Bhagwanpur") {
      const { BHAGWANPUR_1_OPTIONS, BHAGWANPUR_2_OPTIONS } = await import("./constants/bhagwanpur");
      const pollingStationsMapping = { "Bhagwanpur-1": BHAGWANPUR_1_OPTIONS, "Bhagwanpur-2": BHAGWANPUR_2_OPTIONS };
      options = block ? pollingStationsMapping[block] : [...BHAGWANPUR_1_OPTIONS, ...BHAGWANPUR_2_OPTIONS];
      setPollingStationOptions(options);
    } else if (constituency === "218 Egra") {
      const { EGRA_1_OPTIONS, EGRA_2_OPTIONS, EGRA_MUNICIPALITY_OPTIONS } = await import("./constants/egra");
      const pollingStationsMapping = { "Egra-1": EGRA_1_OPTIONS, "Egra-2": EGRA_2_OPTIONS, "Egra Municipality": EGRA_MUNICIPALITY_OPTIONS };
      options = block ? pollingStationsMapping[block] : [...EGRA_1_OPTIONS, ...EGRA_2_OPTIONS, ...EGRA_MUNICIPALITY_OPTIONS];
      setPollingStationOptions(options);
    }
  };

  const getPollingLocation = async (booth) => {
    const booth_id = booth?.split("-")[0]?.trim();
    if (booth_id) {
      if (selectedConstituency === "212 Patashpur") {
        const { PATASHPUR_MAPS_MAPPING } = await import("./constants/patashpur");
        const location = PATASHPUR_MAPS_MAPPING[booth_id];
        setPollingStationLocation(location);
      } else if (selectedConstituency === "214 Bhagwanpur") {
        const { BHAGWANPUR_MAPS_MAPPING } = await import("./constants/bhagwanpur");
        const location = BHAGWANPUR_MAPS_MAPPING[booth_id];
        setPollingStationLocation(location);
      } else if (selectedConstituency === "218 Egra") {
        const { EGRA_MAPS_MAPPING } = await import("./constants/egra");
        const location = EGRA_MAPS_MAPPING[booth_id];
        setPollingStationLocation(location);
      }
    }
    return null;
  };

  const fetchPollingStationDetails = async (booth_name) => {
    const booth_id = booth_name.split("-")[0]?.trim();
    const constituency_id = selectedConstituency.split(" ")[0]?.trim();
    setIsFetching(true);
    const booth_history_res = await fetch(`/api/booth-history?booth_id=${booth_id}&constituency_id=${constituency_id}`, { method: "GET" });
    if (booth_history_res.ok) {
      const res_json = await booth_history_res.json();
      setIsFetching(false);
      setData(res_json.data);
    } else {
      setData([]);
      const res_json = await booth_history_res.json();
      setIsFetching(false);
      toast.error(res_json.message);
    }
    const booth_details_res = await fetch(`/api/booth-details?booth_id=${booth_id}&constituency_id=${constituency_id}`, { method: "GET" });
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
          <div className="font-medium">
            Parliamentary Constituency <span className="text-rose-700">*</span>
          </div>
          <div className="mb-6">
            <Select
              isSearchable={false}
              instanceId="Parliamentary Constituency"
              options={PARLIAMENTARY_OPTIONS.map((el) => ({ label: el, value: el }))}
              value={{ label: selectedParliament, value: selectedParliament }}
              onChange={(e) => {
                setParliament(e.value);
                setConstituency("");
                setBlock("");
                setPollingStation("");
                getPollingStationOptions();
                setData([]);
                setBoothPictures({});
              }}
            />
          </div>
          <div className="font-medium">
            Assembly Constituency <span className="text-rose-700">*</span>
          </div>
          <div className="mb-6">
            <Select
              isSearchable={false}
              instanceId="Assembly Constituency"
              options={ASSEMBLY_OPTIONS[selectedParliament]?.map((el) => ({ label: el, value: el }))}
              value={{ label: selectedConstituency, value: selectedConstituency }}
              onChange={(e) => {
                setConstituency(e.value);
                setBlock("");
                setPollingStation("");
                getPollingStationOptions(e.value);
                setData([]);
                setBoothPictures({});
              }}
            />
          </div>
          <div className="font-medium">Block</div>
          <div className="mb-6">
            <Select
              isSearchable={false}
              instanceId="block"
              options={BLOCK_NAME_OPTIONS[selectedConstituency]?.map((el) => ({ label: el, value: el }))}
              value={{ label: selectedBlock, value: selectedBlock }}
              onChange={(e) => {
                setBlock(e.value);
                setPollingStation("");
                getPollingStationOptions(selectedConstituency, e.value);
                setData([]);
                setBoothPictures({});
              }}
            />
          </div>
          <div className="font-medium">
            Part number/Polling station name <span className="text-rose-700">*</span>
          </div>
          <div className="mb-6">
            <Select
              instanceId="polling"
              options={pollingStationOptions?.map((el) => ({ label: el, value: el }))}
              value={{ label: selectedPollingStation, value: selectedPollingStation }}
              onChange={(e) => {
                setPollingStation(e.value);
                setData([]);
                setBoothPictures({});
                fetchPollingStationDetails(e.value);
                getPollingLocation(e.value);
              }}
            />
          </div>
          {isFetching && <Loader />}
          {data.length > 0 && (
            <div>
              <LineGraph data={data} />
              {/* <div className="font-medium">Entry time</div>
              <div className="mb-6">{liveCount.entry_time?.slice(0, -3)}</div>
              <div className="font-medium">Male persons in line</div>
              <div className="mb-6">{liveCount.male_count}</div>
              <div className="font-medium">Female persons in line</div>
              <div className="mb-6">{liveCount.female_count}</div>
              <div className="font-medium">Total persons in line</div>
              <div className="mb-6">{liveCount.male_count + liveCount.female_count}</div> */}
              {pollingStationLocation && (
                <a className="mb-6 block text-blue-700 mt-6" href={pollingStationLocation} target="_blank">
                  Click here to visit your polling station and vote
                </a>
              )}
            </div>
          )}
          {Object.keys(boothPictures).length > 0 && (
            <div>
              <div className="mb-3 font-medium">Today's polling station pictures</div>
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
