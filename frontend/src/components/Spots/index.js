import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import SpotCard from "../SpotTile";

const SpotsIndex = () => {
  const spots = useSelector((state) => state.spots);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div>
      <ul>
        {Object.values(spots).map((spot) => (
          <Link to={`/spots/${spot.id}`} key={spot.id}>
            <SpotCard spot={spot} />
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SpotsIndex;
