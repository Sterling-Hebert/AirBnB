import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchSpot, putSpot } from "../../store/spots";
import "../SpotForm/SpotForm.css";

const SpotUpdateForm = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const dispatch = useDispatch();
  const history = useHistory();

  const [validationErrors, setValidationErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const updateCountry = (e) => setCountry(e.target.value);
  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateLat = (e) => setLat(e.target.value);
  const updateLng = (e) => setLng(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);

  useEffect(() => {
    const errors = [];
    if (!country?.length) errors.push("Country is required");
    if (!address?.length) errors.push("Address is required");
    if (!city?.length) errors.push("City is required");
    if (!state?.length) errors.push("State is required");
    if (!Number(lat)) errors.push("Latitude is required");
    if (!Number(lng)) errors.push("Longitude is required");
    if (!description?.length) errors.push("Description is required");
    if (!name?.length) errors.push("Name is required");
    if (!Number(price)) errors.push("Price is required");
    setValidationErrors(errors);
  }, [country, city, address, state, lat, lng, description, name, price]);

  useEffect(() => {
    dispatch(fetchSpot(spotId));
  }, [dispatch]);

  useEffect(() => {
    setCountry(spot?.country);
    setAddress(spot?.address);
    setCity(spot?.city);
    setState(spot?.state);
    setLat(spot?.lat);
    setLng(spot?.lng);
    setDescription(spot?.description);
    setName(spot?.name);
    setPrice(spot?.price);
  }, [spot]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true);
    if (validationErrors.length) return alert("Cannot Submit");

    const payload = {
      id: spotId,
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    };

    let updatedSpot = await dispatch(putSpot(payload));
    setAddress("");
    setCity("");
    setCountry("");
    setDescription("");
    setLat("");
    setLng("");
    setName("");
    setPrice("");
    setHasSubmitted(false);
    if (updatedSpot) {
      history.push(`/spots/${updatedSpot.id}`);
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h1 className="form">Update Your Spot</h1>
        <h2 className="form">Where's your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <label htmlFor="Country">Country</label>
        {hasSubmitted && !country && (
          <label htmlFor="Country" className="field-error">
            Country is required
          </label>
        )}
        <input
          className="full"
          type="text"
          name="Country"
          placeholder="Country"
          required={true}
          value={country}
          onChange={updateCountry}
        />
        <label htmlFor="Address">Street Address</label>
        {hasSubmitted && !address && (
          <label htmlFor="Address" className="field-error">
            Address is required
          </label>
        )}
        <input
          className="full"
          type="text"
          name="Address"
          placeholder="Address"
          required={true}
          value={address}
          onChange={updateAddress}
        />
        <label htmlFor="City">City</label>
        {hasSubmitted && !city && (
          <label htmlFor="City" className="field-error">
            City is required
          </label>
        )}
        <input
          className="full"
          type="text"
          name="City"
          placeholder="City"
          required={true}
          value={city}
          onChange={updateCity}
        />
        <label htmlFor="State">State</label>
        {hasSubmitted && !state && (
          <label htmlFor="State" className="field-error">
            State is required
          </label>
        )}
        <input
          className="full"
          type="text"
          name="State"
          placeholder="STATE"
          required={true}
          value={state}
          onChange={updateState}
        />
        <label htmlFor="Latitude">Latitude</label>
        {hasSubmitted && !lat && (
          <label htmlFor="Latitude" className="field-error">
            Latitude is required
          </label>
        )}
        <input
          className="full"
          type="text"
          name="Latitude"
          placeholder="Latitude"
          required={true}
          min="-180"
          max="180"
          value={lat}
          onChange={updateLat}
        />
        <label htmlFor="Longitude">Longitude</label>
        {hasSubmitted && !lng && (
          <label htmlFor="Longitude" className="field-error">
            Longitude is required
          </label>
        )}
        <input
          className="full"
          type="text"
          name="Longitude"
          placeholder="Longitude"
          required={true}
          min="-180"
          max="180"
          value={lng}
          onChange={updateLng}
        />
        <div className="borderBottom"></div>
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <textarea
          className="desc"
          name="Description"
          placeholder="Please write at least 30 characters"
          required={true}
          minLength="30"
          value={description}
          onChange={updateDescription}
        />
        {hasSubmitted && description.length < 30 && (
          <label htmlFor="Description" className="field-error">
            Description needs a minimum of 30 characters
          </label>
        )}
        <div className="borderBottom"></div>
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <input
          className="full"
          type="text"
          name="Name"
          placeholder="Name of your spot"
          required={true}
          value={name}
          onChange={updateName}
        />
        {hasSubmitted && !name && (
          <label htmlFor="Name" className="field-error">
            Name is required
          </label>
        )}
        <div className="borderBottom"></div>
        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        $
        <input
          className="price"
          type="text"
          name="Price"
          placeholder="Price per night (USD)"
          required={true}
          value={price}
          onChange={updatePrice}
        />
        {hasSubmitted && !price && (
          <label htmlFor="Price" className="field-error">
            Price is required
          </label>
        )}
        <div className="borderBottom"></div>
        <button className="createButton" type="submit">
          Update Your Spot
        </button>
      </form>
    </div>
  );
};

export default SpotUpdateForm;
