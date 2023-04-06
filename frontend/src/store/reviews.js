import { csrfFetch } from "./csrf";

//loader
const LOAD_SPOT_REVIEWS = "reviews/LOAD_SPOT_REVIEWS";
const SUBMIT_REVIEW = "reviews/SUBMIT_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

// action handlers

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const payload = await response.json();
    dispatch(loadSpotReviews(payload.Reviews));
  }
};
//ask blake
export const postReview = (payload, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const review = await response.json();
  dispatch(submitReview(review));
  return review;
};

export const deleteReview = (revId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${revId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const review = await response.json();
    dispatch(killReview(revId));
  }
};

// actions
export const loadSpotReviews = (reviews) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews,
});
export const submitReview = (review) => ({
  type: SUBMIT_REVIEW,
  review,
});
export const killReview = (revId) => ({
  type: DELETE_REVIEW,
  revId,
});

const initialState = {};

export const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS:
      const allReviews = {};
      if (!action.reviews) return allReviews;
      action.reviews.forEach((review) => {
        allReviews[review.id] = review;
      });
      return allReviews;
    case SUBMIT_REVIEW:
      return { ...state, [action.review.id]: action.review };
    case DELETE_REVIEW:
      const newState = { ...state };
      delete newState[action.revId];
      return newState;
    default:
      return state;
  }
};
