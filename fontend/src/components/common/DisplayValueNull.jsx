export default function DisplayValueNull({ value }) {
  if (value === null || value === undefined || value === "" || value === "null") {
    return <span className="text-gray-400 italic">No Data</span>;
  }
  return <>{value}</>;
}