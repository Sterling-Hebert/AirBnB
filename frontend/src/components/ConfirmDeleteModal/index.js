import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteSpot, fetchUserSpots } from "../../store/spots";
import "./ConfirmDeleteModal.css";

function ConfirmDeleteModal({ spotId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = async (e) => {
    e.preventDefault();

    await dispatch(deleteSpot(spotId)).then(closeModal());
    history.go(0);
  };
  return (
    <div className="modal">
      <h1 className="form-header">Confirm Delete</h1>
      <label className="daLabel">
        Are you sure you want to remove this spot?
      </label>
      <button className="delete" onClick={handleDelete}>
        Yes (Delete Spot)
      </button>
      <button className="modal-button" onClick={closeModal}>
        No (Keep Spot)
      </button>
      <form></form>
    </div>
  );
}

export default ConfirmDeleteModal;
