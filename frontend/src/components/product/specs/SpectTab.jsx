import { memo } from "react";
import SpecRow from "./SpecRow";

const SpecTab = ({ spec }) => (
  <div className="space-y-0">
    {spec.details
      .filter(d => d.value && d.value !== "-")
      .map((detail, i) => (
        <SpecRow key={i} label={detail.label} value={detail.value} />
      ))}
  </div>
);

export default memo(SpecTab);
