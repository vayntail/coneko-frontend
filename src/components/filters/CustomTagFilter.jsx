import Dropdown from "../common/Dropdown";
import { useFilters } from "../../context/FilterContext";

/**
 * (What is this?)
 * CustomTagFilter component - Allows users to filter game sessions by custom tags
 * These are predefined tags like "Mic Required", "Tank", "Healer", etc.
 * (maybe in the future we'll allow users to create thier own)
 * Uses multi-select since sessions can have multiple tags
 */
const CustomTagFilter = () => {
  // Get the customTags state, setter function, and options from context
  const { customTags, setCustomTags, customTagOptions } = useFilters();

  return (
    <Dropdown
      label="Custom Filters"
      options={customTagOptions}
      selected={customTags}
      onSelect={setCustomTags}
      allowMultiple={true} // Allow multiple tag selection
      showSelectedCount={true} // Show count when tags are selected
      className="customTagFilter"
    />
  );
};

export default CustomTagFilter;
