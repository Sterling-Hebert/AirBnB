import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchSpotReviews, postReview } from "../../store/reviews";
import { fetchSpot } from "../../store/spots";
import "./PostReview.css";

function PostReviewModal({ spotId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);

  const updateReview = (e) => setReview(e.target.value);
  const updateStars = (e) => setStars(e.target.value);

  useEffect(() => {
    const errors = [];
    if (!review.length) errors.push("Review text is required");
    if (stars <= 0) errors.push("Stars are required");
  }, [review, stars]);

  const handleStar = (e, val) => {
    e.preventDefault();
    setStars(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true);
    if (validationErrors.length) return alert("Cannot Submit");

    const payload = {
      review,
      stars,
    };
    //si
    let newReview = dispatch(postReview(payload, spotId));
    setReview("");
    setStars(0);
    setHasSubmitted(false);
    if (newReview) {
      //await
      dispatch(fetchSpotReviews(spotId));
      dispatch(fetchSpot(spotId)).then(closeModal());
    }
  };

  return (
    <div className="modal">
      <h1 className="form-header">How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="review-body"
          type="text"
          name="review"
          placeholder="Leave your review here..."
          required={true}
          value={review}
          onChange={updateReview}
        />
        <label>Stars:</label>
        <i
          onClick={(e) => {
            handleStar(e, 1);
          }}
          className={stars < 1 ? "fa-regular fa-star" : "fa-solid fa-star"}
        />
        <i
          onClick={(e) => {
            handleStar(e, 2);
          }}
          className={stars < 2 ? "fa-regular fa-star" : "fa-solid fa-star"}
        />
        <i
          onClick={(e) => {
            handleStar(e, 3);
          }}
          className={stars < 3 ? "fa-regular fa-star" : "fa-solid fa-star"}
        />
        <i
          onClick={(e) => {
            handleStar(e, 4);
          }}
          className={stars < 4 ? "fa-regular fa-star" : "fa-solid fa-star"}
        />
        <i
          onClick={(e) => {
            handleStar(e, 5);
          }}
          className={stars < 5 ? "fa-regular fa-star" : "fa-solid fa-star"}
        />
        <button
          className="modal-button"
          type="submit"
          disabled={review.length < 10 || stars < 1}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default PostReviewModal;
