// main home page.

import { useState, useEffect } from "react";
import GameSessionList from "../../components/gameSession/GameSessionList";
import { FilterProvider } from "../../context/FilterContext";
import FilterBar from "../../components/filters/FilterBar";
import NewRequestButton from "../../components/form/NewRequestButton";
import "./Home.scss";

function Home() {
  // State to force refresh of the filter provider
  const [refreshKey, setRefreshKey] = useState(0);

  // Handler for when a new session is created
  const handleSessionCreated = (newSession) => {
    console.log("New session created:", newSession);

    // Force the FilterProvider to reload by changing its key prop
    setRefreshKey((prevKey) => prevKey + 1);

    // Optional: show a success message
    alert("Game session created successfully!");
  };

  return (
    <div className="home">
      <div className="select">
        <h2>Groups</h2>
        <h2>Players</h2>
      </div>
      <br />
      <br />
      <div className="featured">
        <form className="slogan">
          <h3>Daily Changing Slogan</h3>
          <input type="text" placeholder="Create a Group" />
          <input type="search" placeholder="Group Finder" />
        </form>
      </div>
      <br />
      <br />

      {/* main games requests list */}
      <FilterProvider key={`filter-provider-${refreshKey}`}>
        {/* Add the NewRequestButton at the top right */}
        <div className="headerActions">
          <NewRequestButton onSessionCreated={handleSessionCreated} />
        </div>

        <FilterBar />
        <GameSessionList />
      </FilterProvider>
    </div>
  );
}

export default Home;
