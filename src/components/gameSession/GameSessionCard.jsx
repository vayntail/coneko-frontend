// ================================
// 📍 Update Join Button Feedback (Join/Unjoin Toggle)
// ================================
// In GameSessionCard.jsx:

import React, { useState } from "react";
import "./GameCard.scss";
import placeholderImg from "../../assets/placeholders/placeholder-img.png";
import UserCircle from "./UserCircle";
import creatorImg from "../../assets/placeholders/isCreator.png"; // Crown Icon Lenny

const GameSessionCard = (props) => {
  const [hasJoined, setHasJoined] = useState(false);

  const onJoinButtonClick = () => {
    setHasJoined((prev) => !prev); // Toggle join/unjoin
    console.log(hasJoined ? "LEFT SESSION" : "JOINED SESSION!");
    // Here you'd implement join/leave API logic or localStorage handling
  };

  const game = props.game || {};
  game.currentPlayers = game.currentPlayers || 1;

  return (
    <div className="card flex-horizontal">
      {/* ============================== TEMPORARY LOCALSTORAGE IMPLEMENTATION ============================== */}
      {game.isLocalOnly && <div className="local-badge">Local</div>}
      {/* ============================================================================================== */}

      <div className="flex-horizontal">
        <div className="filter-icons">
          {/* Display platform */}
          <div>{game.platform || "Unknown"}</div>

          {/* Display region */}
          <div>{game.gameRegion || "Unknown"}</div>

          {/* Display genre */}
          <div>{game.gameGenre || "Unknown"}</div>
        </div>

        {game.gameImage ? (
          <img className="game-img" src={game.gameImage} alt={game.gameTitle} />
        ) : (
          <img
            className="game-img"
            src={placeholderImg}
            alt="Game placeholder"
          />
        )}

        <div className="mid-box">
          <h2>{game.gameTitle || "Untitled Game"}</h2>
          <p>{game.requestDescription || "No description available"}</p>

          {/* ============================== USER ICONS SECTION  Lenny ============================== */}
          <div className="user-circles">
            {Array.from({ length: game.playersNeeded || 1 }).map((_, index) => (
              <UserCircle
                key={index}
                user={{
                  isCreator: index === 0,
                  isSelected: hasJoined && index !== 0, // Show selected if joined
                  playerNumber: index + 1,
                }}
              />
            ))}

            {/* + icon if more than playersNeeded */}
            {game.currentPlayers > game.playersNeeded && (
              <div className="extra-players">+</div>
            )}
          </div>
          {/* ================================================================================== */}
        </div>
      </div>

      <div className="join-box">
        <p>
          {game.scheduledTime
            ? new Date(game.scheduledTime).toLocaleString()
            : "No time specified"}
        </p>
        <p>
          {/* Display current/max players */}
          {Array.isArray(game.currentPlayers)
            ? game.currentPlayers.length
            : game.currentPlayers}
          /{game.playersNeeded || 0}
        </p>
        <button
          onClick={onJoinButtonClick}
          className={hasJoined ? "joined-button" : "join-button"}
        >
          {hasJoined ? "Leave Room" : "Join Room"}
        </button>
      </div>
    </div>
  );
};

export default GameSessionCard;
