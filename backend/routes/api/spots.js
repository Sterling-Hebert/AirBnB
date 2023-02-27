const express = require("express");
const { Model } = require("sequelize");
const { Sequelize } = require(".");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Spot,
  Review,
  SpotImage,
  ReviewImage,
  User,
  Booking,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { json } = require("sequelize");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const router = express.Router();

const queryValueCheck = [
  check("page")
    .if(check("page").exists())
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .if(check("size").exists())
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .if(check("maxLat").exists())
    .isFloat({ min: -500, max: 500 })
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .if(check("minLat").exists())
    .isFloat({ min: -500, max: 500 })
    .withMessage("Minimum latiude is invalid"),
  check("maxLng")
    .if(check("maxLat").exists())
    .isFloat({ min: -500, max: 500 })
    .withMessage("Maximum longitude is invalid"),
  check("minLng")
    .if(check("minLng").exists())
    .isFloat({ min: -500, max: 500 })
    .withMessage("Mininum longitude is invalid"),
  check("maxPrice")
    .if(check("maxPrice").exists())
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  handleValidationErrors,
];

// finding all spots
router.get("/", queryValueCheck, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 20;
  }
  if (!minLat) {
    minLat = -500;
  }
  if (!maxLat) {
    maxLat = 500;
  }
  if (!minLng) {
    minLng = -500;
  }
  if (!maxLng) {
    maxLng = 500;
  }
  if (!minPrice) {
    minPrice = 0;
  }
  if (!maxPrice) {
    maxPrice = 10000000000;
  }

  page = Number(page);
  size = Number(size);

  const spots = await Spot.findAll({
    where: {
      lat: { [Op.between]: [minLat, maxLat] },
      lng: { [Op.between]: [minLng, maxLng] },
      price: { [Op.between]: [minPrice, maxPrice] },
    },
    include: [
      {
        model: Review,
      },
      {
        model: SpotImage,
      },
    ],
    offset: (page - 1) * size,
    limit: size,
  });

  spots.forEach((spot) => {
    for (let image of spot.SpotImages) {
      if (image.dataValues.preview) {
        spot.dataValues.previewImage = image.url;
      }
      if (!spot.dataValues.previewImage) {
        spot.dataValues.previewImage = "No preview image";
      }
      delete spot.dataValues.SpotImages;
    }
    let starAvg = 0;

    for (let review of spot.Reviews) {
      starAvg += review.dataValues.stars;
    }
    starAvg = starAvg / spot.Reviews.length;
    spot.dataValues.avgRating = starAvg;
    if (!spot.dataValues.avgRating) {
      spot.dataValues.avgRating = "No reviews yet";
    }
    delete spot.dataValues.Reviews;
  });

  return res.json({ Spots: spots, page, size });
});

//finding current users spots
router.get("/current", requireAuth, async (req, res, next) => {
  const Spots = await Spot.findAll({
    where: { ownerId: req.user.id },
  });
  if (Spots) {
    res.json({ Spots });
  } else {
    res.json("No spots for this current user");
  }
});

// finding details of a spot based off spotid

router.get("/:spotId", async (req, res) => {
  const foundSpot = await Spot.findByPk(req.params.spotId);

  if (!foundSpot) {
    const errorSpot = {
      message: `Spot couldn't be found`,
      statusCode: 404,
    };
    return res.json(errorSpot);
  }
  const foundSpotValid = await Spot.scope(["allDetails"]).findByPk(
    req.params.spotId,
    {
      attributes: {
        group: ["Spot.Id"],
      },
    }
  );

  res.json(foundSpotValid);
});

const spotParamsCheck = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal({ checkFalsy: true })
    .toFloat()
    .withMessage("Latitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .notEmpty()
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal({ checkFalsy: true })
    .toFloat()
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

//create spot
router.post("/", spotParamsCheck, requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const ownerId = req.user.id;

  const spot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat: lat,
    lng: lng,
    name,
    description,
    price,
  });
  return res.json(spot);
});

//add image by spotid
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  // const userId = req.user.id;
  // const spotId = req.params;
  // const user = await Spot.findOne({ where: { ownerId: userId, id: spotId } });
  // if (!user) {
  //   const err = new Error("Unauthorized access");
  //   err.title = "Forbidden";
  //   err.errors = ["Forbidden"];
  //   err.status = 403;
  //   return next(err);
  // }

  const currentspot = await Spot.findByPk(req.params.spotId);

  if (!currentspot) {
    res.status(404);
    res.json({
      message: "Spot could not be found",
      statusCode: 404,
    });
  } else {
    if (currentspot.ownerId === req.user.id) {
      const { url, preview } = req.body;
      const newImage = await SpotImage.create({
        spotId: req.params.spotId,
        url: url,
        preview: preview,
      });

      return res.status(200).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview,
      });
    }
    if (currentspot.ownerId !== req.user.id) {
      res.status(403).json({
        message: "Forbidden",
        status: 403,
      });
    }
  }
});

//EDIT SPOT
router.put("/:spotId", spotParamsCheck, requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  if (!spot.ownerId === req.user.id) {
    res.status(401);
    res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  } else {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    spot.save();
    res.json(spot);
  }
});

//DELETE SPOT

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const Deleted = await Spot.findByPk(req.params.spotId);
  if (!Deleted) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  if (Deleted.ownerId === req.user.id) {
    if (Deleted) {
      await Deleted.destroy();
      res.json({
        message: "Successfully deleted",
        statusCode: 200,
      });
    }
  } else {
    res.status(403);
    res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  }
});

//get reviews based off spotid
router.get("/:id/reviews", async (req, res) => {
  const allReviewsSpot = await Review.findAll({
    where: {
      spotId: req.params.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: {
          exclude: ["reviewId", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  if (!allReviewsSpot.length) {
    res.status(404).json({ message: "Spot couldnt be found", statusCode: 404 });
  }

  res.json(allReviewsSpot);
});

//post review by spotid

const reviewValidation = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review in text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

router.post("/:id/reviews", reviewValidation, requireAuth, async (req, res) => {
  let findspot = await Spot.findByPk(req.params.id, {
    include: { model: Review },
  });
  if (!findspot) {
    res.status(404).json({ message: "Spot couldnt be found", statusCode: 404 });
  }
  const checkforReview = await Review.findOne({
    where: { userId: req.user.id, spotId: req.params.id },
  });
  if (checkforReview) {
    return res.status(403).json({
      message: "User already has a review for this spot",
      statusCode: 403,
    });
  }
  let newReview = await Review.create({
    userId: req.user.id,
    spotId: Number(req.params.id),
    review: req.body.review,
    stars: req.body.stars,
  });
  res.json(newReview);
});

// Get all Bookings for a Spot based on the Spot's id

router.get("/:id/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id);
  if (!spot) {
    return res
      .status(404)
      .json({ message: "Spot couldn't be found", statusCode: 404 });
  }
  const booking = await Booking.findAll({
    where: { spotId: spot.id },
    include: {
      model: User,
      attributes: {
        exclude: [
          "username",
          "email",
          "hashedPassword",
          "createdAt",
          "updatedAt",
        ],
      },
    },
  });
  const ownerBookingTest = [];
  booking.forEach((ele) => {
    if (ele.userId === req.user.id) {
      ownerBookingTest.push({
        User: {
          id: ele.userId,
          firstName: ele.User.firstName,
          lastName: ele.User.lastName,
        },
        id: ele.id,
        spotId: ele.spotId,
        id: ele.userId,
        startDate: ele.startDate.toISOString().slice(0, 10), //globalobject date
        endDate: ele.endDate.toISOString().slice(0, 10),
        createdAt: ele.createdAt,
        updatedAt: ele.updatedAt,
      });
    } else {
      ownerBookingTest.push({
        spotId: ele.spotId,
        startDate: ele.startDate.toISOString().slice(0, 10),
        endDate: ele.endDate.toISOString().slice(0, 10),
      });
    }
  });
  res.json({ Bookings: ownerBookingTest });
});

// Create a Booking from a Spot based on the Spot's id

router.post("/:id/bookings", requireAuth, async (req, res, next) => {
  const { startDate, endDate, createdAt, updatedAt } = req.body;
  const spotId = req.params.id;

  const currentspot = await Spot.findByPk(spotId);

  if (!currentspot) {
    res.status(404);
    res.json({
      message: "Spot could not be found",
      statusCode: 404,
    });
  }
  if (currentspot.ownerId === req.user.id) {
    return res.status(403).json({
      message: "Forbidden, You cannot book your own spot",
      statusCode: 403,
    });
  }
  if (startDate >= endDate) {
    return res.json({
      message: "Validation error",
      statusCode: 400,
      errors: ["Booking's end date cannot be before or on start date"],
    });
  }

  const existingBookings = await Booking.findAll({
    attributes: [
      [sequelize.fn("date", sequelize.col("startDate")), "startDate"],
      [sequelize.fn("date", sequelize.col("endDate")), "endDate"],
    ],
    where: {
      spotId,
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate: { [Op.between]: [startDate, endDate] } },
        { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } },
      ],
    },
  });
  if (existingBookings.length) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      statusCode: 403,
      errors: [
        "Start date conflicts with an existing booking",
        "End date conflicts with an existing booking",
      ],
    });
  }

  const newBooking = await Booking.create({
    userId: req.user.id,
    spotId: Number(req.params.id),
    startDate: startDate,
    endDate: endDate,
    createdAt: createdAt,
    updatedAt: updatedAt,
  });
  let newBookingObj = {
    id: newBooking.id,
    userId: newBooking.userId,
    spotId: newBooking.spotId,
    startDate: newBooking.startDate.toISOString().slice(0, 10),
    endDate: newBooking.endDate.toISOString().slice(0, 10),
    createdAt: newBooking.createdAt.toISOString().slice(0, 10),
    updatedAt: newBooking.updatedAt.toISOString().slice(0, 10),
  };
  res.json(newBookingObj);
});

module.exports = router;
