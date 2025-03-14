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

  // Show message if no sessions found
  if (filteredSessions.length === 0) {
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
      {filteredSessions.map((gameSession) => (
        <li
          key={gameSession._id || gameSession.id}
          className="game-session-item"
        >
          <GameSessionCard game={gameSession} />
        </li>
      ))}
    </ul>
  );
};

export default GameSessionList;
