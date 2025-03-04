// src/components/TestPlatformFilter.jsx
import { FilterProvider } from "../../context/FilterContext";
import PlatformFilter from "../filters/PlatformFilter";
import { useFilters } from "../../context/FilterContext";

// Component to display the selected platforms
const SelectedPlatforms = () => {
  // Get platforms from context
  const { platforms, platformOptions } = useFilters();

  // Find the label for each selected platform value
  const getLabel = (value) => {
    const option = platformOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Selected Platforms:</h3>
      {platforms.length === 0 ? (
        <p>No platforms selected</p>
      ) : (
        <ul>
          {platforms.map((platform) => (
            <li key={platform}>{getLabel(platform)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main test component
const TestPlatformFilter = () => {
  return (
    <FilterProvider>
      <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
        <h2>Platform Filter Test</h2>
        <p>Try selecting different platforms from the dropdown:</p>

        <PlatformFilter />
        <SelectedPlatforms />
      </div>
    </FilterProvider>
  );
};

export default TestPlatformFilter;
