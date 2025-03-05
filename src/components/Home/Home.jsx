import { useState, useEffect } from "react";
import "./Home.scss";

function Home() {
  return (
    <div className="home">
      <div className="select">
        <h2>Groups</h2>
        <h2>Players</h2>
      </div>
      <br />
      <br />
      <div className="featured">
        <form className="slogan">
          <h3>Daily Changing Slogan</h3>
          <input type="text" placeholder="Create a Group" />
          <input type="search" placeholder="Group Finder" />
        </form>
      </div>
      <br />
      <br />
      <div>
        <form className="categories">
          <select>
            <option>All Platforms</option>
            <option>PC</option>
            <option>PlayStation</option>
            <option>Xbox</option>
          </select>
          <select>
            <option>Genres</option>
            <option>RPG</option>
            <option>MMO</option>
            <option>FPS</option>
            <option>Survival</option>
          </select>
          <select>
            <option>All Regions</option>
            <option>NA</option>
            <option>EU</option>
            <option>AS</option>
          </select>
          <select>
            <option>Any Group Size</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
          <input type="search" placeholder="search" />
        </form>
      </div>
    </div>
  );
}

export default Home;
