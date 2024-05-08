import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineGraph({ data }) {
  const latest_entry = data.at(-1);
  const latest_total_count = latest_entry?.male_count + latest_entry?.female_count;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = data.map((el) => el.entry_time.slice(0, -3));
  const graph_data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Male",
        data: data.map((el) => el.male_count),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        fill: true,
        label: "Female",
        data: data.map((el) => el.female_count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        fill: true,
        label: "Total",
        data: data.map((el) => el.male_count + el.female_count),
        borderColor: "rgb(35,178,214)",
        backgroundColor: "rgba(35,178,214, 0.5)",
      },
    ],
  };
  return (
    <>
      <Line options={options} data={graph_data} />
      <div className="mt-6">
        At {latest_entry?.entry_time?.slice(0, -3)}, there are around {latest_total_count} people in queue at your Polling Station
      </div>
    </>
  );
}
