import { useState } from "react";
import GameSessionList from "../../components/gameSession/GameSessionList";
import { FilterProvider } from "../../context/FilterContext";
import FilterBar from "../../components/filters/FilterBar";
import NewRequestButton from "../../components/form/NewRequestButton";
import "./Home.scss";

/**
 * Home component - Main page of the LFG application
 * Wraps child components in the FilterProvider for state management
 */
function Home() {
  // State to force refresh of the filter provider
  const [refreshKey, setRefreshKey] = useState(0);

  // State for notifications
  const [notification, setNotification] = useState(null);

  // Handler for when a new session is created
  const handleSessionCreated = (newSession) => {
    console.log("New session created:", newSession);

    // Force the FilterProvider to reload by changing its key prop
    setRefreshKey((prevKey) => prevKey + 1);

    // Show a notification
    const isLocal = newSession.isLocalOnly;
    setNotification({
      message: `Game session created successfully!${
        isLocal ? " (Stored locally)" : ""
      }`,
      type: isLocal ? "warning" : "success",
    });

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
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

      {/* Show notification if present */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {/* Main game sessions list */}
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
