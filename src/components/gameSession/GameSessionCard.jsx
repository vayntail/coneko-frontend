import "./GameCard.scss";
import placeholderImg from "../../assets/placeholders/placeholder-img.png";
import UserCircle from "./UserCircle";
import creatorImg from "../../assets/placeholders/isCreator.png"; // Crown Icon Lenny

const GameSessionCard = (props) => {
  const onJoinButtonClick = () => {
    console.log("JOINED!");
    // Here you'd implement the join functionality with the API
  };

  // Safely get the game object, ensure it exists
  const game = props.game || {};

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

        {/* Check if game img exists */}
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
            {/* Generate circles based on playersNeeded (maximum capacity) */}
            {Array.from({ length: game.playersNeeded || 0 }).map((_, index) => (
              <UserCircle
                key={index}
                user={{
                  isCreator: index === 0,
                  isSelected: index < (game.currentPlayers?.length || 1),
                  playerNumber: index + 1,
                }}
              />
            ))}

            {/* + Icon if more actual players exist than shown visually */}
            {game.currentPlayers?.length > game.playersNeeded && (
              <span className="extra-players">+</span>
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
          1/{game.playersNeeded || 0}
        </p>
        <button onClick={onJoinButtonClick}>Join</button>
      </div>
    </div>
  );
};

export default GameSessionCard;
