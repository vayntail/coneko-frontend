import "./GameCard.scss";
import placeholderImg from "../../assets/placeholders/placeholder-img.png";
import UserCircle from "./UserCircle";
import leaderImg from "../../assets/placeholders/leader.png"; // Add Crown Icon Here

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

          {props.game.genres.map((genre) => (
            <div key={genre}>{genre}</div>
          ))}
        </div>
        {props.game.img ? (
          <img className="game-img" src={props.game.img} />
        ) : (
          <img className="game-img" src={placeholderImg} />
        )}

        <div className="mid-box">
          <h2>{props.game.title}</h2>
          <p>{props.game.description}</p>
          <div className="user-circles">
            {/* Crown Icon for the Leader */}
            {props.game.currentPlayers.map((player, index) => (
              <UserCircle
                key={index}
                user={{
                  ...player,
                  isLeader: index === 0, // First user will always have the crown   ////Lenny///
                }}
              />
            ))}
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
