import { useState } from "react";
import { FilterProvider } from "../context/FilterContext";
import FilterBar from "../components/filters/FilterBar";
import GameSessionList from "../components/gameSession/GameSessionList";
import GameSessionForm from "./Home/HomeForm";

//What is this?
/**
 * Main HomePage component that integrates all the key features:
 * - Filter system
 * - Game session listing
 * - Game session creation form
 */

const HomePage = () => {
  // State to toggle between viewing sessions and creating a new one
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="homePage">
      {/* Wrap everything in FilterProvider to share filter state */}
      <FilterProvider>
        <header className="pageHeader">
          <h1>Looking For Group</h1>

          {/* Toggle button to switch between views */}
          <button
            className="toggleViewBtn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Back to Game Sessions" : "Create New Session"}
          </button>
        </header>

        {/* Conditional rendering based on which view is active */}
        {showForm ? (
          // Show the game session creation form
          <GameSessionForm />
        ) : (
          // Show the filter bar and game sessions list
          <div className="gameSessionsView">
            {/* Filter bar with all filter options */}
            <FilterBar />

            {/* List of game sessions that match the filters */}
            <GameSessionList />
          </div>
        )}
      </FilterProvider>
    </div>
  );
};

export default HomePage;
