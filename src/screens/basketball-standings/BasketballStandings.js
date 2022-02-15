import { useParams } from "react-router-dom";

export const BasketballStandings = () => {
  const { year } = useParams();
  return (
    <div>
      <h1>{`${year} Basketball Standings`}</h1>
    </div>
  );
};
