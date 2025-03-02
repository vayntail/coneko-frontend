import TestDropdown from "./components/test/TestDropdown";
import TestFilterContext from "./components/test/TestFilterContext";
import { FilterProvider } from "./context/FilterContext";
import TestPlatformFilter from "./components/test/TestPlatformFilter";
function App() {
  return (
    <>
      <div>Hello World~! go team!</div>
      <TestDropdown />

      <FilterProvider>
        <TestFilterContext />
      </FilterProvider>

      <TestPlatformFilter />
    </>
  );
}

export default App;
