import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT = "spots/LOAD_SPOT";
const LOAD_USER_SPOTS = "spots/LOAD_USER_SPOTS";
const ADD_SPOT = "spots/ADD_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";

const ADD_IMAGES = "spots/ADD_IMAGES";

// action handlers
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const payload = await response.json();
    dispatch(loadSpots(payload.Spots));
  }
};
export const fetchSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const payload = await response.json();
    dispatch(loadSpot(payload));
    return payload;
  }
};
export const fetchUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");

  if (response.ok) {
    const payload = await response.json();

    dispatch(loadUserSpots(payload.Spots));
  }
};
export const postSpot = (payload) => async (dispatch) => {
  //object of arrays format
  let { imagesArr } = payload;
  imagesArr = imagesArr.map((url, i) => {
    let obj = {};
    if (i === 0) {
      obj.preview = true;
      obj.url = url;
    } else {
      obj.preview = false;
      obj.url = url;
    }
    return obj;
  });

  //send to server
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const spot = await response.json();
    for await (let image of imagesArr) {
      let imageRes = await csrfFetch(`/api/spots/${spot.id}/images`, {
        method: "POST",
        body: JSON.stringify(image),
      });
      imageRes = await imageRes.json();
      dispatch(addImages(imageRes));
    }
    dispatch(addSpot(spot));
    return spot;
  }
};
export const putSpot = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${payload.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const spot = await response.json();
    dispatch(updateSpot(spot));
    return spot;
  }
};
export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const spot = await response.json();
    dispatch(killSpot(spot));
    return spot;
  }
};

// actions
export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});
export const loadSpot = (spot) => ({
  type: LOAD_SPOT,
  spot,
});
export const loadUserSpots = (spots) => ({
  type: LOAD_USER_SPOTS,
  spots,
});
export const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});
export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});
export const killSpot = (spot) => ({
  type: DELETE_SPOT,
  spot,
});
export const addImages = (image) => ({
  type: ADD_IMAGES,
  image,
});

const initialState = {};

export const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const allSpots = {};
      action.spots.forEach((spot) => {
        allSpots[spot.id] = spot;
      });
      return {
        ...allSpots,
        ...state,
      };
    }
    case UPDATE_SPOT:
    case ADD_SPOT:
    case LOAD_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case LOAD_USER_SPOTS:
      const allSpots = {};
      action.spots.forEach((spot) => {
        allSpots[spot.id] = spot;
      });
      return { ...allSpots };
    case DELETE_SPOT:
      const newState = { ...state };
      delete newState[action.spot.id];
      return { ...newState };
    // return {
    //   ...state,
    //   spots: state.spots.filter((spot) => spot.id !== action.payload.id),
    // };

    case ADD_IMAGES:
      return { ...state, [action.image.id]: { ...state[action.image.id] } };
    default:
      return state;
  }
};
