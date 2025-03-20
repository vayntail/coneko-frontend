import GameSessionCard from "./GameSessionCard";
import { useFilters } from "../../context/FilterContext";
import "./GameSessionList.scss";

const GameSessionList = () => {
  const { filteredSessions, isLoading, error } = useFilters();

  // Show loading message
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading game sessions...</p>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Check to ensure filteredSessions is an array
  const sessionsArray = Array.isArray(filteredSessions) ? filteredSessions : [];

  // Show message if no sessions found
  if (sessionsArray.length === 0) {
    return (
      <div className="no-results">
        <p>No game sessions found matching your filters.</p>
        <p>Try adjusting your search criteria or create a new session.</p>
      </div>
    );
  }

  // Render the list of sessions
  return (
    <ul className="game-session-list">
      {sessionsArray.map((gameSession) => (
        <li
          key={gameSession._id || gameSession.id}
          className="game-session-item"
        >
          <GameSessionCard
            key={gameSession.id}
            game={{
              ...gameSession,
              playersNeeded: 6, // Always 6 Slots
              currentPlayers: gameSession.currentPlayers || 1, // At least the creator
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default GameSessionList;
