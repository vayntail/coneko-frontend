import GameSessionList from "./components/gameSession/GameSessionList";
// import TestFilterBar from "./components/test/TestFilterBar";
import CompleteFilterSystemTest from "./components/test/CompleteFilterSystemTest";
import { FilterProvider } from "./context/FilterContext";
import FilterBar from "./components/filters/FilterBar";

/* Testing Imports */
// import TestDropdown from "./components/test/TestDropdown";
// import TestFilterContext from "./components/test/TestFilterContext";
// import { FilterProvider } from "./context/FilterContext";
// import TestPlatformFilter from "./components/test/TestPlatformFilter";
// import TestSearchBar from "./components/test/TestSearchBar";

function App() {
  return (
    <>
      {/* <TestFilterBar /> */}
      {/* <CompleteFilterSystemTest /> */}

      <FilterProvider>
        <FilterBar />
        <GameSessionList />
      </FilterProvider>
    </>
  );
}

export default App;
