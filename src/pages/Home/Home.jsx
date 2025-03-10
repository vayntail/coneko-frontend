// main home page.

import { useState, useEffect } from "react";
import GameSessionList from "../../components/gameSession/GameSessionList";
import { FilterProvider } from "../../context/FilterContext";
import FilterBar from "../../components/filters/FilterBar";
import NewRequestButton from "../../components/form/NewRequestButton";
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

      <NewRequestButton />
      {/* main games requests list */}
      <FilterProvider>
        <FilterBar />
        <GameSessionList />
      </FilterProvider>
    </div>
  );
}

export default Home;
