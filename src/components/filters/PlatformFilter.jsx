import Dropdown from "../common/Dropdown";
import { useFilters } from "../../context/FilterContext";

//(What is this?)
//Component that Allows Users to filter game sessions by platform
//This component doesn't manage its own state - it gets everything from context

const PlatformFilter = () => {
  //Get what we need from the filer context
  // - platforms: current selected platforms array
  // - setPlatforms: function to update selected platforms
  // - platformOptions: list of available platforms to choose from
  const { platforms, setPlatforms, platformOptions } = useFilters();

  return (
    <Dropdown
      label="Platforms" // Default when nothing is selected
      options={platformOptions} //List of options PC, PS5 etc
      selected={platforms} //current selected platform
      onSelect={setPlatforms} //Function to call when selection changes
      allowMultiple={true} //Allow selecting multiple platforms
      showSelectedCount={true} //Show count when items are selected
      className="platformFilter" //(For the part that matter the most. . .Aka the styling)
    />
  );
};

export default PlatformFilter;
