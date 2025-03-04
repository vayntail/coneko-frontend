// src/components/TestFilterBar.jsx
import { FilterProvider } from "../../context/FilterContext";
import FilterBar from "../filters/FilterBar";
import { useFilters } from "../../context/FilterContext";

// Component to display all the current filter settings
const FilterDisplay = () => {
  // Get all filter states from context
  const {
    platforms,
    platformOptions,
    genres,
    genreOptions,
    regions,
    regionOptions,
    groupSize,
    groupSizeOptions,
    customTags,
    customTagOptions,
    searchTerm,
  } = useFilters();

  // Helper function to get label for a value
  const getLabel = (value, options) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div
      style={{
        marginTop: "30px",
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "5px",
      }}
    >
      <h3>Current Filter Settings:</h3>

      {/* Platforms */}
      <div>
        <h4>Platforms:</h4>
        {platforms.length === 0 ? (
          <p>No platforms selected</p>
        ) : (
          <ul>
            {platforms.map((platform) => (
              <li key={platform}>{getLabel(platform, platformOptions)}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Genres */}
      <div>
        <h4>Genres:</h4>
        {genres.length === 0 ? (
          <p>No genres selected</p>
        ) : (
          <ul>
            {genres.map((genre) => (
              <li key={genre}>{getLabel(genre, genreOptions)}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Regions */}
      <div>
        <h4>Regions:</h4>
        {regions.length === 0 ? (
          <p>No regions selected</p>
        ) : (
          <ul>
            {regions.map((region) => (
              <li key={region}>{getLabel(region, regionOptions)}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Group Size Filter */}
      <div>
        <h4>Group Size:</h4>
        {groupSize ? (
          <p>{getLabel(groupSize, groupSizeOptions)}</p>
        ) : (
          <p>Any group size</p>
        )}
      </div>

      {/* Custom Tags */}
      <div>
        <h4>Custom Tags:</h4>
        {customTags.length === 0 ? (
          <p>No custom tags selected</p>
        ) : (
          <ul>
            {customTags.map((tag) => (
              <li key={tag}>{getLabel(tag, customTagOptions)}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4>Search Term:</h4>
        {searchTerm ? <p>"{searchTerm}"</p> : <p>No search term</p>}
      </div>
    </div>
  );
};

// Main test component
const TestFilterBar = () => {
  return (
    <FilterProvider>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2>Complete Filter Bar Test</h2>
        <p>Try using the different filters below:</p>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <FilterBar />
        </div>

        <FilterDisplay />
      </div>
    </FilterProvider>
  );
};

export default TestFilterBar;
