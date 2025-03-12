import { useFilters } from "../../context/FilterContext";
import UserCircle from "../gameSession/UserCircle"; //Lenny///

////////////lenny ///////////////
const exampleSession = {
  title: "Example Game",
  description: "Sample description for testing.",
  platform: "PC",
  region: "NA",
  currentPlayers: [
    { pic: "", isSelected: false, isLeader: true }, // First player is always the leader
    { pic: "", isSelected: false, isLeader: false }, // Empty Slot
    { pic: "", isSelected: false, isLeader: false }, // Empty Slot
    { pic: "", isSelected: false, isLeader: false }, // Empty Slot
    { pic: "", isSelected: false, isLeader: false }, // Empty Slot
  ],
  maxPlayers: 5,
};

//////////////////Lenny////////////////

/**
 * Simple component to display a single game session card
 */
const GameSessionCard = ({ session }) => {
  // Helper function to format the player count
  const formatPlayerCount = () => {
    return `${session.currentPlayers.length}/${session.maxPlayers}`;
  };

  /////////////// Lenny Additions /////////////////
  const handleUserClick = (index) => {
    session.currentPlayers = session.currentPlayers.map((player, i) => ({
      ...player,
      isSelected: i === index ? !player.isSelected : player.isSelected,
    }));
  };
  //////////////////////////////////////////////////

  return (
    <div
      className="gameCard"
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>{session.title}</h3>
        <span>{formatPlayerCount()} Players</span>
      </div>

      <p style={{ margin: "10px 0" }}>{session.description}</p>

      {/* User Circles - Display horizontally */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        {session.currentPlayers.map((player, index) => (
          <UserCircle
            key={index}
            user={player}
            onClick={() => handleUserClick(index)} //Lenny Additions
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong>Platform:</strong> {session.platform}
          <span style={{ margin: "0 10px" }}>|</span>
          <strong>Region:</strong> {session.region}
        </div>

        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Join
        </button>
      </div>

      {/* Display custom tags if present */}
      {session.customTags && session.customTags.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Tags:</strong> {session.customTags.join(", ")}
        </div>
      )}
    </div>
  );
};

/**
 * Component to display a list of filtered game sessions
 */
const GameSessionList = () => {
  // Get filtered sessions and loading state from context
  const { filteredSessions, isLoading } = useFilters();

  // If still loading, show loading message
  if (isLoading) {
    return <div>Loading game sessions...</div>;
  }

  // If no sessions match filters, show message
  if (filteredSessions.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "30px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
        }}
      >
        <h3>No matching game sessions found</h3>
        <p>Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  // Render the list of session cards
  return (
    <div className="game-session-list">
      <h2>Game Sessions ({filteredSessions.length})</h2>
      {filteredSessions.map((session) => (
        <GameSessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};

export default GameSessionList;
