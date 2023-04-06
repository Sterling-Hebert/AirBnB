import "./spotCard.css";

const SpotCard = ({ spot }) => {
  const rating = parseFloat(spot.avgRating).toFixed(2);
  return (
    <div className="card" title={spot.name}>
      <img className="cardImage" src={spot.previewImage} alt="spot" />
      <div className="spotInfoDiv">
        <p className="tile-name">
          {spot.city}, {spot.state}
          <br />
          <b>${spot.price}</b>/Per Night
        </p>
      </div>
      <div className="spotRating">
        {parseFloat(spot.avgRating) === 0 ? (
          <p>
            <i className="fa-solid fa-star"></i> New
          </p>
        ) : (
          <p>
            <i className="fa-solid fa-star"></i> {rating}
          </p>
        )}
      </div>
    </div>
  );
};

export default SpotCard;
