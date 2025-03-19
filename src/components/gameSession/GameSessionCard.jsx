import "./GameCard.scss";
import placeholderImg from "../../assets/placeholders/placeholder-img.png";
import UserCircle from "./UserCircle";

/**
 * GameSessionCard component
 * Displays a single game session with all its details
 * Supports both API data format and locally stored format
 */
const GameSessionCard = ({ game }) => {
  const onJoinButtonClick = () => {
    console.log("JOINED!");
    // Here you'd implement the join functionality
  };

  // Safely get the game object, ensure it exists
  const gameData = game || {};

  // Handle the different field names between API and frontend
  const getTitle = () =>
    gameData.gameTitle || gameData.title || "Untitled Game";
  const getDescription = () =>
    gameData.requestDescription ||
    gameData.description ||
    "No description available";

  // Get platforms - could be in different fields
  const getPlatforms = () => {
    if (Array.isArray(gameData.platforms) && gameData.platforms.length > 0) {
      return gameData.platforms;
    }
    return gameData.platform ? [gameData.platform] : ["Unknown"];
  };

  // Get regions - could be in different fields
  const getRegions = () => {
    if (Array.isArray(gameData.regions) && gameData.regions.length > 0) {
      return gameData.regions;
    }
    return gameData.gameRegion ? [gameData.gameRegion] : ["Unknown"];
  };

  // Get genres - could be in different fields
  const getGenres = () => {
    if (Array.isArray(gameData.genres) && gameData.genres.length > 0) {
      return gameData.genres;
    }
    return gameData.gameGenre ? [gameData.gameGenre] : ["Unknown"];
  };

  // Get player count info
  const getCurrentPlayers = () => gameData.currentPlayers || 1;
  const getMaxPlayers = () =>
    gameData.maxPlayers || gameData.playersNeeded || 1;

  // Get image
  const getImage = () => gameData.gameImage || gameData.img || placeholderImg;

  // Format scheduled time
  const getScheduledTime = () => {
    if (!gameData.scheduledTime) return "No time specified";
    try {
      return new Date(gameData.scheduledTime).toLocaleString();
    } catch (e) {
      return gameData.scheduledTime;
    }
  };

  return (
    <div className="card flex-horizontal">
      {/* Show local badge for sessions stored only in localStorage */}
      {gameData.isLocalOnly && (
        <div className="local-badge" title="Stored locally only">
          Local
        </div>
      )}

      <div className="flex-horizontal">
        <div className="filter-icons">
          {/* Display platforms */}
          {getPlatforms().map((platform, index) => (
            <div key={`platform-${index}-${platform}`} className="platform-tag">
              {platform}
            </div>
          ))}

          {/* Display regions */}
          {getRegions().map((region, index) => (
            <div key={`region-${index}-${region}`} className="region-tag">
              {region}
            </div>
          ))}

          {/* Display genres */}
          {getGenres().map((genre, index) => (
            <div key={`genre-${index}-${genre}`} className="genre-tag">
              {genre}
            </div>
          ))}
        </div>

        {/* Game image */}
        <img
          className="game-img"
          src={getImage()}
          alt={getTitle()}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />

        <div className="mid-box">
          <h2>{getTitle()}</h2>
          <p>{getDescription()}</p>
          <div className="user-circles">
            <UserCircle user={gameData.user || ""} />
          </div>
        </div>
      </div>

      <div className="join-box">
        <p>{getScheduledTime()}</p>
        <p>
          {/* Display current/max players */}
          {getCurrentPlayers()}/{getMaxPlayers()}
        </p>
        <button onClick={onJoinButtonClick}>Join</button>
      </div>
    </div>
  );
};

export default GameSessionCard;
