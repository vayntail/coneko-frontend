import Dropdown from "../common/Dropdown";
import { useFilters } from "../../context/FilterContext";

//(What is this?)
//Component that Allows Users to filter game sessions by Player Requirement

const GroupSizeFilter = () => {
  // Get the groupSize state, setter function, and options from context
  const { groupSize, setGroupSize, groupSizeOptions } = useFilters();

  // Convert single selection to array format for checkbox UI
  const selectedArray = groupSize ? [groupSize] : [];

  // Handle selection in array format
  const handleGroupSizeSelect = (newSelected) => {
    // If array is empty, clear selection
    if (newSelected.length === 0) {
      setGroupSize("");
    }
    // If there's one item selected and it's different from current selection
    else if (newSelected.length === 1) {
      setGroupSize(newSelected[0]);
    }
    // If new selection has multiple items (user selected a new one while having one already selected)
    else {
      // Find the newly added value (the one that's in newSelected but wasn't in selectedArray)
      const newValue = newSelected.find(
        (value) => !selectedArray.includes(value)
      );
      // Set only the new value
      setGroupSize(newValue);
    }
  };

  return (
    <Dropdown
      label="Any Group Size"
      options={groupSizeOptions}
      selected={selectedArray}
      onSelect={handleGroupSizeSelect}
      allowMultiple={true} // This gets us checkbox UI
      showSelectedCount={false} // Don't show the count
      showSelectAll={false} // Don't show the "Select All" option
      className="groupSizeFilter"
    />
  );
};

export default GroupSizeFilter;
