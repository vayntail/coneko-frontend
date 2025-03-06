import { useEffect, useState } from "react";
import GameSessionForm from "./HomeForm";
import GameSessionList from "../../components/gameSession/GameSessionList";
import { FilterProvider } from "../../context/FilterContext";
import FilterBar from "../../components/filters/FilterBar";

export default () => {
  const [gameSessions, setGameSessions] = useState([]);

  useEffect(() => {
    const savedSessions =
      JSON.parse(localStorage.getItem("gameSessions")) || [];
    setGameSessions(savedSessions);
  }, []);
  return (
    <div className="Home">
      <GameSessionForm />
      <FilterProvider>
        <FilterBar />
        <GameSessionList />
      </FilterProvider>

      <div className="TestList">
        <h2>Saved Sessions</h2> <br />
        {gameSessions.length === 0 ? (
          <p>No sessions</p>
        ) : (
          <ul>
            {gameSessions.map((session) => (
              <li key={session.id}>
                <h3>{session.title}</h3>
                <p>{session.description}</p>
                <p>
                  <strong>Platform:</strong> {session.platform}
                </p>
                <p>
                  <strong>Players:</strong> {session.currentPlayers}/
                  {session.maxPlayers}
                </p>
                <p>
                  <strong>Status:</strong> {session.status}
                </p>
                <p>
                  <strong>Tags:</strong> {session.customTags.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
