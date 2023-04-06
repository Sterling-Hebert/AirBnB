import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteSpot, fetchUserSpots } from "../../store/spots";

function ConfirmDeleteModal({ spotId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spotId)).then(closeModal());
    // history.go(0)
  };
  return (
    <div className="modal">
      <h1 className="form-header">Confirm Delete</h1>
      <label>
        Are you sure you want to remove this spot from the listings?
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
