import { useState } from "react";
import axios from "axios";
import PageContainer from "../components/layout/PageContainer";

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/community", {
        name,
        description,
        slug,
      });
      setMessage(`Community '${response.data.name}' created successfully!`);
    } catch (error) {
      console.error("Error creating community:", error);
      setMessage("Failed to create community.");
    }
  };

  return (
    <PageContainer>
      <h1>Create a New Community</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Slug:</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Community</button>
      </form>
      {message && <p>{message}</p>}
    </PageContainer>
  );
};

export default CreateCommunity;
