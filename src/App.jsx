import TestDropdown from "./components/test/TestDropdown";
import TestFilterContext from "./components/test/TestFilterContext";
import { FilterProvider } from "./context/FilterContext";
function App() {
  return (
    <>
      <div>Hello World~! go team!</div>
      <TestDropdown />

      <FilterProvider>
        <TestFilterContext />
      </FilterProvider>
    </>
  );
}

export default App;
