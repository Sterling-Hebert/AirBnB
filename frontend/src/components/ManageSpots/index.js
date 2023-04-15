import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserSpots } from "../../store/spots";
import { Link, useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import SpotCard from "../SpotTile";
import "./ManageSpots.css";

const ManageSpotsIndex = () => {
  const spots = useSelector((state) => state.spots);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleUpdate = (spotId) => {
    history.push(`/spots/${spotId}/edit`);
  };

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);
  return (
    <div>
      <h1 className="manageHeading">Manage Spots</h1>

      <button className="createSpotButtonNav">
        <Link to="/spots/new">Create a New Spot</Link>
      </button>
      {!Object.values(spots) ? (
        <Link to="/spots/new">Create a New Spot</Link>
      ) : (
        <ul>
          <div className="rim">
            {Object.values(spots).map((spot) => (
              <div className="formatSpotContainer" key={spot.id}>
                <Link to={`/spots/${spot.id}`} key={spot.id}>
                  <SpotCard spot={spot} />
                </Link>
                <br />
                <button
                  className="button-left"
                  onClick={() => {
                    handleUpdate(spot.id);
                  }}
                >
                  Update
                </button>
                <OpenModalButton
                  className="button-right"
                  buttonText="Delete"
                  modalComponent={<ConfirmDeleteModal spotId={spot.id} />}
                />
              </div>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

export default ManageSpotsIndex;
