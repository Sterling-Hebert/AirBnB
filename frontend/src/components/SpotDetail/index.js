import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpot } from "../../store/spots";
import SpotReviews from "../SpotReviews";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const reviewCount = Object.values(
    useSelector((state) => state.reviews)
  ).length;
  const dispatch = useDispatch();
  const rating = parseFloat(spot?.avgRating).toFixed(1);

  const reserveClick = () => {
    alert("Feature Coming Soon");
  };

  useEffect(() => {
    // window.location.reload();
    dispatch(fetchSpot(spotId));
  }, [dispatch]);

  return (
    <div className="page">
      <h1>{spot?.name}</h1>
      <p>
        {spot?.city}, {spot?.state}, {spot?.country}
      </p>
      <div className="imagesContainer">
        {spot?.SpotImages &&
          spot?.SpotImages.map((img, i) => {
            return <img className={`image${i}`} key={img.id} src={img.url} />;
          })}
      </div>
      <div className="description">
        <h2>
          Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}
        </h2>
        <p>Description: {spot?.description}</p>
        <div className="infoBox">
          <p>${spot?.price}/ Per Night</p>
          {reviewCount === 0 ? (
            <p>
              <span>&#11088;</span> New
            </p>
          ) : (
            <p>
              <span>&#11088;</span> {rating} · {reviewCount}{" "}
              {reviewCount > 1 ? "Reviews" : "Review"}
            </p>
          )}

          <button onClick={reserveClick}>Reserve</button>
        </div>
      </div>

      <div className="reviewContainer">
        {reviewCount === 0 ? (
          <p>
            {/* <h1>Reviews:</h1> */}
            <h1>No Reviews!</h1>
            {/* <i className="fa-solid fa-star"></i> New */}
          </p>
        ) : (
          <p>
            <span>&#11088;</span> {rating} · {reviewCount}
            {reviewCount > 1 ? " Reviews" : " Review"}
          </p>
        )}
        <SpotReviews />
      </div>
    </div>
  );
};

export default SpotDetail;
