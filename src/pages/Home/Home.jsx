//main home page

import { useState } from "react";
import GameSessionList from "../../components/gameSession/GameSessionList";
import { FilterProvider } from "../../context/FilterContext";
import FilterBar from "../../components/filters/FilterBar";
import NewRequestButton from "../../components/form/NewRequestButton";
import "./Home.scss";

function Home() {
  const [notification, setNotification] = useState(null);

  // Handler for when a new session is created
  const handleSessionCreated = (newSession) => {
    console.log("New session created:", newSession);

    // Show success notification
    setNotification({
      type: "success",
      message: "Game session created successfully!",
    });

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="home">
      <div className="select">
        <h2>Groups</h2>
        <h2>Players</h2>
      </div>

      <div className="featured">
        <form className="slogan">
          <h3>Daily Changing Slogan</h3>
          <input type="text" placeholder="Create a Group" />
          <input type="search" placeholder="Group Finder" />
        </form>
      </div>

      {/* Show notification if exists */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Main game requests list */}
      <FilterProvider>
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
