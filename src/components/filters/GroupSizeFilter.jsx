import Dropdown from "../common/Dropdown";
import { useFilters } from "../../context/FilterContext";

//(What is this?)
//Component that Allows Users to filter game sessions by Player Requriment. EX:...do you really need one? (2players)

const GroupSizeFilter = () => {
  // Get the groupSize state, setter function, and options from context
  const { groupSize, setGroupSize, groupSizeOptions } = useFilters();

  return (
    <Dropdown
      label="Any Group Size"
      options={groupSizeOptions}
      selected={groupSize}
      onSelect={setGroupSize}
      allowMultiple={false} // Only one size category at a time
      className="groupSizeFilter"
    />
  );
};

export default GroupSizeFilter;
