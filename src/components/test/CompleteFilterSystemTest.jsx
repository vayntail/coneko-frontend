// src/components/CompleteFilterSystemTest.jsx

import { FilterProvider } from "../../context/FilterContext";
import FilterBar from "../filters/FilterBar";
import GameSessionList from "./TestGameSessionList";

/**
 * Component to test the complete filter system
 * Shows the filter bar and the filtered game sessions
 */
const CompleteFilterSystemTest = () => {
  return (
    <FilterProvider>
      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <h1>LFG Filter System</h1>

        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h2>Filters</h2>
          <FilterBar />
        </div>

        <GameSessionList />
      </div>
    </FilterProvider>
  );
};

export default CompleteFilterSystemTest;
