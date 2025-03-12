import "./GameCard.scss";
import placeholderImg from "../../assets/placeholders/placeholder-img.png";
import UserCircle from "./UserCircle";

const GameSessionCard = (props) => {
  const onJoinButtonClick = () => {
    console.log("JOINED!");
  };

  // Safely get the game object, ensure it exists
  const game = props.game || {};

  return (
    <div className="card flex-horizontal">
      <div className="flex-horizontal">
        <div className="filter-icons">
          {/* Display platform(s) */}
          {Array.isArray(game.platforms) && game.platforms.length > 0 ? (
            // If platforms array exists, map through it
            game.platforms.map((platform, index) => (
              <div key={`platform-${index}`}>{platform}</div>
            ))
          ) : (
            // Fallback to single platform or unknown
            <div>{game.platform || "Unknown"}</div>
          )}

          {/* Display region(s) */}
          {Array.isArray(game.gameRegion) && game.gameRegion.length > 0 ? (
            // If regions array exists, map through it
            game.gameRegion.map((region, index) => (
              <div key={`region-${index}`}>{region}</div>
            ))
          ) : (
            // Fallback to single region or unknown
            <div>{game.region || "Unknown"}</div>
          )}

          {/* Display genre(s) */}
          {Array.isArray(game.gameGenre) && game.gameGenre.length > 0 ? (
            game.gameGenre.map((genre, index) => (
              <div key={`genre-${index}`}>{genre}</div>
            ))
          ) : (
            <div>No genres</div>
          )}
        </div>

        {/* Check if game img exists */}
        {game.img ? (
          <img className="game-img" src={game.img} alt={game.gameTitle} />
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
          <div className="user-circles">
            <UserCircle user={""} />
          </div>
        </div>
      </div>

      <div className="join-box">
        <p>{game.scheduledTime || "No time specified"}</p>
        <p>
          {game.currentPlayers || 0}/{game.maxPlayers || 0}
        </p>
        <button onClick={onJoinButtonClick}>Join</button>
      </div>
    </div>
  );
};

export default GameSessionCard;
