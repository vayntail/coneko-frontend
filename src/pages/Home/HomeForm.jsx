import React, { useState } from "react";
import InputField from "../../components/inputField/InputField";

const GameSessionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "",
    genres: "",
    region: "",
    currentPlayers: "",
    maxPlayers: "",
    status: "",
    customTags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGameSession = {
      id: Date.now(),
      ...formData,
      customTags: formData.customTags.split(",").map((tag) => tag.trim()), // Convert tags to array
    };

    // Save to localStorage
    const existingSessions =
      JSON.parse(localStorage.getItem("gameSessions")) || [];
    localStorage.setItem(
      "gameSessions",
      JSON.stringify([...existingSessions, newGameSession])
    );

    // Bye bye form data
    setFormData({
      title: "",
      description: "",
      platform: "",
      genres: "",
      region: "",
      currentPlayers: "",
      maxPlayers: "",
      status: "",
      customTags: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="Form">
      <InputField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />

      <InputField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <InputField
        label="Platform"
        name="platform"
        value={formData.platform}
        onChange={handleChange}
      />

      <InputField
        label="Genres"
        name="genres"
        value={formData.genres}
        onChange={handleChange}
      />

      <InputField
        label="Region"
        name="region"
        value={formData.region}
        onChange={handleChange}
      />

      <InputField
        label="Current Players"
        name="currentPlayers"
        type="number"
        value={formData.currentPlayers}
        onChange={handleChange}
      />

      <InputField
        label="Max Players"
        name="maxPlayers"
        type="number"
        value={formData.maxPlayers}
        onChange={handleChange}
      />

      <InputField
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
      />

      <InputField
        label="Custom Tags"
        name="customTags"
        value={formData.customTags}
        onChange={handleChange}
      />

      <button type="submit">Create Game Session</button>
    </form>
  );
};

export default GameSessionForm;
