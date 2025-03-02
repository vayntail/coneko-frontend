import TestDropdown from "./components/test/TestDropdown";
import TestFilterContext from "./components/test/TestFilterContext";
import { FilterProvider } from "./context/FilterContext";
import TestPlatformFilter from "./components/test/TestPlatformFilter";
import TestSearchBar from "./components/test/TestSearchBar";
function App() {
  return (
    <>
      <div>Hello World~! go team!</div>
      <TestDropdown />

      <FilterProvider>
        <TestFilterContext />
      </FilterProvider>

      <TestPlatformFilter />
      <TestSearchBar />
    </>
  );
}

export default App;
