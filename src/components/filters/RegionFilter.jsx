import Dropdown from "../common/Dropdown";
import { useFilters } from "../../context/FilterContext";

//(What is this?)
//Component that Allows Users to filter game sessions by Region. EX: NA (north Murica), EU (Europe) JP (Japan) Etc

const RegionFilter = () => {
  // Get the regions state, setter function, and options from context
  const { regions, setRegions, regionOptions } = useFilters();

  return (
    <Dropdown
      label="All Regions"
      options={regionOptions}
      selected={regions}
      onSelect={setRegions}
      allowMultiple={true} // Allow multiple region selection
      showSelectedCount={true} // Show count when regions are selected
      className="regionFilter"
    />
  );
};

export default RegionFilter;
