import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PageContainer from "../components/layout/PageContainer";

const CommunityDetails = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`/api/community/id/${id}`);
        setCommunity(response.data);
      } catch (error) {
        console.error("Error fetching community details:", error);
      }
    };

    fetchCommunity();
  }, [id]);

  if (!community) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <div>
        <h1>{community.name}</h1>
        <p>{community.desc}</p>
        <p>Members: {community.members}</p>
        <p>Posts: {community.posts}</p>
      </div>
    </PageContainer>
  );
};

export default CommunityDetails;
