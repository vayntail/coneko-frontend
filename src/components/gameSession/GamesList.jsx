import gameSessions from "../../assets/mockData/gameSessions";
import GameCard from "./GameCard";

const GamesList = () => {
  return (
    <ul>
      {gameSessions.map((gameSession) => (
        <li key={gameSession.id}>
          <GameCard game={gameSession} />
        </li>
      ))}
    </ul>
  );
};

export default GamesList;
