import { useFilters } from "../../context/FilterContext";

const TestFilterContext = () => {
  // Get values and functions from the context
  const {
    platforms,
    setPlatforms,
    genres,
    setGenres,
    searchTerm,
    setSearchTerm,
    resetFilters,
  } = useFilters();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Filter Context Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Platform Filter</h3>
        <button onClick={() => setPlatforms(["pc"])}>Set PC Only</button>
        <button onClick={() => setPlatforms(["pc", "ps5"])}>
          Set PC and PS5
        </button>
        <p>Selected platforms: {platforms.join(", ")}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Genre Filter</h3>
        <button onClick={() => setGenres(["fps"])}>Set FPS Only</button>
        <button onClick={() => setGenres(["fps", "rpg"])}>
          Set FPS and RPG
        </button>
        <p>Selected genres: {genres.join(", ")}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Search</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search"
        />
        <p>Search term: {searchTerm}</p>
      </div>

      <button
        onClick={resetFilters}
        style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          marginTop: "20px",
        }}
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default TestFilterContext;
