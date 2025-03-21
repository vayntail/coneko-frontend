import "./GameCard.scss";
import placeholderImg from "../../assets/placeholders/placeholder-img.png";
import UserCircle from "./UserCircle";

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

          {/* ============================== USER ICONS SECTION ============================== */}
          <div className="user-circles">
            {/* Creator Slot Always First */}
            <UserCircle user={{ isCreator: true }} />

            {/* Dynamically Show Only the Number of Requested Player Slots */}
            {[...Array(Math.min(props.game.playersNeeded - 1, 5))].map(
              (_, index) => (
                <UserCircle
                  key={index}
                  user={{
                    isSelected: index < (props.game.currentPlayers || 0),
                  }}
                />
              )
            )}

            {/* Show '+' Symbol for Extra Players Beyond 6 */}
            {props.game.currentPlayers > 6 && (
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
