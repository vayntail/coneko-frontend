import "./GameCard.scss";
import placeholderImg from "../../assets/placeholders/placeholder-img.png";
import UserCircle from "./UserCircle";
import leaderImg from "../../assets/placeholders/leader.png"; // Crown Icon Import
import { useState } from "react";

const GameSessionCard = (props) => {
  const [selectedPlayers, setSelectedPlayers] = useState(
    new Array(5).fill(false)
  );

  const handleSelect = (index, isSelected) => {
    const updatedSelection = [...selectedPlayers];
    updatedSelection[index] = isSelected;
    setSelectedPlayers(updatedSelection);
  };

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

          {/* Crown + 5 Grey Slots Here */}
          <div className="user-circles" style={{ marginTop: "30px" }}>
            <UserCircle user={{ isLeader: true }} />

            {[...Array(5)].map((_, index) => (
              <UserCircle
                key={index}
                user={{ isSelected: selectedPlayers[index] }}
                onSelect={(isSelected) => handleSelect(index, isSelected)}
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
