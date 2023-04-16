import "./spotCard.css";

const SpotCard = ({ spot }) => {
  // const rating = parseFloat(spot.avgRating).toFixed(1);

  return (
    <div className="card" title={spot.name}>
      {spot && <img className="cardImage" src={spot.previewImage} />}
      {/* <img className="cardImage" src={spot.previewImage} alt="spot" /> */}
      <div className="spotInfoDiv">
        <p className="tile-name">
          {spot.city}, {spot.state}
          <br />
          <b>${spot.price}</b>/Per Night
        </p>
      </div>
      <div className="spotRating">
        <span>
          &#11088;
          {Number(spot.avgRating) ? Number(spot.avgRating).toFixed(1) : "New"}
        </span>
      </div>
    </div>
  );
};

export default SpotCard;
