import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotReviews } from "../../store/reviews";
import DeleteReviewModal from "../DeleteReviewModal";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal";
import ReviewTile from "../ReviewTile";
import "./SpotReviews.css";

const SpotReviews = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const user = useSelector((state) => state.session.user);

  const reviews = useSelector((state) => state.reviews);
  // const reviews = Object.keys(useSelector((state) => state.reviews));
  console.log(reviews);

  const revArr = Object.values(reviews);
  const alreadyReviewed = revArr.some((rev) => rev.userId === user?.id);

  const sortedReviews = [...revArr].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpotReviews(spotId));
  }, [dispatch]);

  return (
    <div>
      {spot?.ownerId !== user?.id && !alreadyReviewed && user && (
        <>
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<PostReviewModal spotId={spotId} />}
          />
        </>
      )}
      {revArr.length ? (
        revArr.map((rev) => {
          const usersReview = rev.userId === user?.id;
          return (
            <div className="reviewContainer" key={rev.id}>
              <ReviewTile rev={rev} />
              {usersReview && (
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={
                    <DeleteReviewModal revId={rev.id} spotId={spotId} />
                  }
                />
              )}
            </div>
          );
        })
      ) : (
        <p> </p>
      )}
      {spot?.ownerId !== user?.id && !alreadyReviewed && !revArr.length && (
        <p>Be the first to leave a review!</p>
      )}
    </div>
  );
};

export default SpotReviews;
