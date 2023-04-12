import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotReviews } from "../../store/reviews";
import "./ReviewTile.css";

const ReviewTile = ({ rev }) => {
  const user = useSelector((state) => state.session.user);
  const year = rev?.createdAt.slice(0, 4);
  const reviews = useSelector((state) => state.reviews);
  const revArr = Object.values(reviews);
  let monthLetArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemper",
    "October",
    "November",
    "December",
  ];
  let month;
  if (rev.createdAt.slice(5, 6) === "0") {
    month = monthLetArr[rev.createdAt.slice(6, 7) - 1];
  } else {
    month = monthLetArr[rev.createdAt.slice(5, 7) - 1];
  }

  return (
    <div className="review-tile">
      {!rev.User ? (
        <p>
          <b>{user.firstName}</b>
          <br />
          {month} {year}
          <br />
          {rev.review}
          <br />
          {rev.stars} <span>&#11088;</span>
        </p>
      ) : (
        <p>
          <b>{rev.User.firstName}</b>
          <br />
          {month} {year}
          <br />
          {rev.review}
          <br />
          {rev.stars} <span>&#11088;</span>
        </p>
      )}
    </div>
  );
};

export default ReviewTile;
