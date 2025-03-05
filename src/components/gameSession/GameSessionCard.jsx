import "./GameCard.scss";
import placeholderImg from "../../assets/placeholders/placeholder-img.png";
import UserCircle from "./UserCircle";

const GameSessionCard = (props) => {
  const onJoinButtonClick = () => {
    console.log("JOINED!");
  };

  return (
    <div className="card flex-horizontal">
      <div className="flex-horizontal">
        <div className="filter-icons">
          <div>{props.game.platform}</div>
          <div> {props.game.region}</div>

          {/* Handle genres whether they're an array or a comma-separated string */}
          {Array.isArray(props.game.genres)
            ? props.game.genres.map((genre) => <div key={genre}>{genre}</div>)
            : props.game.genres
                ?.split(",")
                .map((genre) => <div key={genre.trim()}>{genre.trim()}</div>)}
        </div>

        {/* Use imageUrl if available, otherwise use placeholder */}
        {props.game.imageUrl ? (
          <img
            className="game-img"
            src={props.game.imageUrl}
            alt={props.game.title}
          />
        ) : (
          <img
            className="game-img"
            src={placeholderImg}
            alt="Game placeholder"
          />
        )}

        <div className="mid-box">
          <h2>{props.game.title}</h2>
          <p>{props.game.description}</p>
          <div className="user-circles">
            <UserCircle user={""} />
          </div>
        </div>
      </div>

      <div className="join-box">
        <p>{props.game.scheduledTime}</p>
        <p>
          {props.game.currentPlayers}/{props.game.maxPlayers}
        </p>
        <button onClick={onJoinButtonClick}>Join</button>
      </div>
    </div>
  );
};

export default GameSessionCard;
