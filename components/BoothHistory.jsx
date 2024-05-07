export default function BoothHistory({ booth_history }) {
  return (
    <div className="px-4 w-full mt-6 md:w-2/3 mb-20">
      <div className="mb-5 font-semibold text-lg">Booth history</div>
      <div className="w-full border border-collapse border-black">
        <div className="flex w-full font-medium">
          <div className="w-1/4 pl-2">
            Entry <br /> time
          </div>
          <div className="w-1/4">
            Male <br /> count
          </div>
          <div className="w-1/4">
            Female <br /> count
          </div>
          <div className="w-1/4">
            Booth
            <br /> image
          </div>
        </div>
        {(booth_history || []).map((el) => (
          <div className="flex w-full py-2" style={{ borderTop: "1px solid black" }}>
            <div className="w-1/4 pl-2">{el.entry_time.slice(0, -3)}</div>
            <div className="w-1/4">{el.male_count}</div>
            <div className="w-1/4">{el.female_count}</div>
            <div className="w-1/4">
              <a href={el.booth_image} target="_blank" className=" text-blue-600">
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
