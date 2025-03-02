import Dropdown from "../common/Dropdown";
import { useFilters } from "../../context/FilterContext";

//(What is this?)
//Component that Allows Users to filter game sessions by Genre. EX: Rpg, Action etc

const GenreFilter = () => {
  //Get the genres state, setter function and options from context
  const { genres, setGenres, genreOptions } = useFilters();

  return (
    <Dropdown
      label="Genres" // Default when nothing is selected
      options={genreOptions} //List of options Puzzle, JRPG etc
      selected={genres} //current selected genre
      onSelect={setGenres} //Function to call when selection changes
      allowMultiple={true} //Allow selecting multiple Genres
      showSelectedCount={true} //Show count when items are selected
      className="genreFilter" //(For the part that matter the most. . .Aka the styling)
    />
  );
};

export default GenreFilter;
