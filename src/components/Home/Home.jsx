import { useEffect, useState } from "react";
import GameSessionForm from "./HomeForm";
import "../pages/Home/Home.css";

//  ROTATING SLOGAN HOOKS
const slogans = [
  "Ready up! It's game time!",
  "Squad up and jump in!",
  "Find your perfect team today.",
];
const [currentSlogan, setCurrentSlogan] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlogan((prev) => (prev + 1) % slogans.length);
  }, 5000);
  return () => clearInterval(interval);
}, []);
//  ROTATING SLOGAN HOOKS END

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

      {/*  SLOGAN DISPLAY GOES HERE */}
      <h2 className="daily-slogan">{slogans[currentSlogan]}</h2>
      {/*  END SLOGAN DISPLAY */}
      {/*just for demo purposes*/}
      <button onClick={() => localStorage.clear()}>
        🧹 Clear LocalStorage
      </button>

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
