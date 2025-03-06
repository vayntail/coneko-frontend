import GameSessionCard from "./GameSessionCard";
import { useFilters } from "../../context/FilterContext";
import "./GameCard.scss";

const GameSessionList = () => {
  const { filteredSessions, isLoading } = useFilters();

  // show message if still loading
  if (isLoading) return <div>loading!</div>;

  // if there's no sessions under the filter, show message
  if (filteredSessions.length === 0) return <div>no search results</div>;

  return (
    <ul>
      {/* map filtered game sessions results */}
      {filteredSessions.map((gameSession) => (
        <li key={gameSession.id}>
          <GameSessionCard key={gameSession.id} game={gameSession} />
        </li>
      ))}
    </ul>
  );
};

export default GameSessionList;
