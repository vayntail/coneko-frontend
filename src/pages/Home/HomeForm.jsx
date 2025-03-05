import React, { useState } from "react";
import InputField from "../../components/inputField/InputField";
import { useFilters } from "../../context/FilterContext"; // Import our custom hook

const GameSessionForm = () => {
  // Get filter options and the addGameSession function from our context
  const { addGameSession, platformOptions, genreOptions, regionOptions } =
    useFilters();

  // Initialize form state with default values
  const [formData, setFormData] = useState({
    title: "", // Game title (required)
    description: "", // Description of the session
    platform: "", // Gaming platform (required)
    genres: "", // Game genres, comma separated
    region: "", // Geographic region (required)
    currentPlayers: "1", // Default to 1 player (the creator)
    maxPlayers: "4", // Default to 4 max players
    status: "ongoing", // Session status (ongoing or scheduled)
    customTags: "", // Custom tags, comma separated
    imageUrl: "", // Added image URL field
  });

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, // Keep existing form data
      [name]: value, // Update only the changed field
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate the form (could add more validation here)
    if (!formData.title || !formData.platform || !formData.region) {
      alert("Please fill in all required fields");
      return;
    }

    // Use the addGameSession function from context to add the new session
    // This will update both localStorage and FilterContext state
    addGameSession(formData);

    // Reset form fields after submission
    setFormData({
      title: "",
      description: "",
      platform: "",
      genres: "",
      region: "",
      currentPlayers: "1",
      maxPlayers: "4",
      status: "ongoing",
      customTags: "",
      imageUrl: "",
    });

    // Optionally show success message
    alert("Game session created successfully!");
  };

  return (
    <div className="create-game-form">
      <h2>Create New Game Session</h2>
      <form onSubmit={handleSubmit} className="Form">
        {/* Game title field */}
        <InputField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Game description field */}
        <InputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Game image URL field */}
        <InputField
          label="Image URL"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/game-image.jpg"
        />

        {/* Platform dropdown - using options from context */}
        <div className="form-group">
          <label>Platform</label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
          >
            <option value="">Select Platform</option>
            {platformOptions.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>

        {/* Genres field - comma separated values */}
        <InputField
          label="Genres (comma separated)"
          name="genres"
          value={formData.genres}
          onChange={handleChange}
          placeholder="fps, rpg, etc."
        />

        {/* Region dropdown - using options from context */}
        <div className="form-group">
          <label>Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="">Select Region</option>
            {regionOptions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Current player count - should be at least 1 */}
        <InputField
          label="Current Players"
          name="currentPlayers"
          type="number"
          value={formData.currentPlayers}
          onChange={handleChange}
          min="1"
        />

        {/* Maximum player count */}
        <InputField
          label="Max Players"
          name="maxPlayers"
          type="number"
          value={formData.maxPlayers}
          onChange={handleChange}
          min="1"
        />

        {/* Session status dropdown */}
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="ongoing">Ongoing</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {/* Custom tags field - comma separated */}
        <InputField
          label="Custom Tags (comma separated)"
          name="customTags"
          value={formData.customTags}
          onChange={handleChange}
          placeholder="mic, competitive, etc."
        />

        {/* Submit button */}
        <button type="submit">Create Game Session</button>
      </form>
    </div>
  );
};

export default GameSessionForm;
