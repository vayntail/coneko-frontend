// src/components/TestSearchBar.jsx
import { FilterProvider } from "../../context/FilterContext";
import SearchBar from "../filters/SearchBar";
import { useFilters } from "../../context/FilterContext";

// Component to display the current search term
const SearchDisplay = () => {
  // Get the search term from context
  const { searchTerm } = useFilters();

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Current Search Term:</h3>
      {searchTerm ? (
        <p>Searching for: "{searchTerm}"</p>
      ) : (
        <p>No search term entered</p>
      )}

      <div style={{ marginTop: "10px" }}>
        <p>
          {/* Makes the User go "oooh wow how cool it auto updates OwO" */}
          {/* At lest no one will see this test comments :) */}
          <strong>Note:</strong> The search term updates after you stop typing
          (with a 300ms delay).
        </p>
        <p>
          This is called "debouncing" and it improves performance by reducing
          excessive updates.
        </p>
      </div>
    </div>
  );
};

// Main test component
const TestSearchBar = () => {
  return (
    <FilterProvider>
      <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
        <h2>Search Bar Test</h2>
        <p>Type in the search bar to see debouncing in action:</p>

        <SearchBar />
        <SearchDisplay />
      </div>
    </FilterProvider>
  );
};

export default TestSearchBar;
