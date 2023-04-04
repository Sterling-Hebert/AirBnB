import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteReview, fetchSpotReviews } from "../../store/reviews";
// import DeleteReviewModal from "../DeleteReviewModal";
import OpenModalButton from "../OpenModalButton";
// import PostReviewModal from "../PostReviewModal";
// import ReviewTile from "../ReviewTile";

const SpotReviews = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const user = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews);
  const revArr = Object.values(reviews);
  const alreadyReviewed = revArr.some((rev) => rev.userId === user?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpotReviews(spotId));
  }, [dispatch]);

  const handleDelete = (revId) => {
    dispatch(deleteReview(revId));
  };

  return (
    <div>
      {spot?.ownerId !== user?.id && !alreadyReviewed && user && (
        <OpenModalButton
          buttonText="Post a Review"
          //   modalComponent={<PostReviewModal spotId={spotId} />}
        />
      )}

      {revArr.length ? (
        revArr.map((rev) => {
          const usersReview = rev.userId === user?.id;
          return (
            <div key={rev.id}>
              {/* <ReviewTile rev={rev} />
              {usersReview && (
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={
                    <DeleteReviewModal revId={rev.id} spotId={spotId} />
                  }
                />
              )} */}
            </div>
          );
        })
      ) : (
        <p>Be the first to leave a review!</p>
      )}
    </div>
  );
};

export default SpotReviews;
