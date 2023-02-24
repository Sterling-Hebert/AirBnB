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

const router = express.Router();

// finding all spots
router.get("/", async (req, res, next) => {
  let allSpots = [];

  allSpots = await Spot.findAll({
    group: ["Spot.id"],
  });
  if (allSpots) {
    return res.json(allSpots);
  }
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

//finding details of a spot based off spotid (reworked)
// router.get("/:spotId", requireAuth, async (req, res) => {
//   const spot = await Spot.findByPk(req.params.spotId, {
//     attributes: {
//       include: [[], []],
//     },
//     include: [
//       {
//         model: Review,
//         attributes: [],
//       },
//       {
//         model: spotImage,
//         attributes: [],
//         where: { preview: true },
//       },
//       {
//         model: User,
//         as: "Owner",
//         attributes: ["id", "firstName", "lastName"],
//       },
//     ],
//     group: ["Spot.id", "Images.url", "Images.id", "Owner.id"],
//   });
//   // Error is spot doesn't exist
//   if (!spot) {
//     const e = new Error("Couldn't find a Spot with the specified id");
//     const errorSpot = {
//       message: `Spot couldn't be found`,
//       statusCode: 404,
//     };
//     return res.json(errorSpot);
//   }
// });

// finding details of a spot based off spotid

router.get("/:spotId", async (req, res) => {
  let id = req.params.spotId;

  let foundSpot = await Spot.scope(["defaultScope", "allDetails"]).findByPk(id);

  if (!foundSpot) {
    const e = new Error("Couldn't find a Spot with the specified id");
    const errorSpot = {
      message: `Spot couldn't be found`,
      statusCode: 404,
    };
    return res.json(errorSpot);
  }
  res.json(foundSpot);
});

router.post("/", async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const ownerId = req.user.id;

  const spot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  return res.json(spot);
});

//add image by spotid
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
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
        previewImage: preview,
      });

      res.json({
        id: newImage.id,
        url: newImage.url,
        previewImage: newImage.previewImage,
      });
    }
    if (currentspot.ownerId !== req.user.id) {
      res.status(401).json({
        message: "Unauthorized action. Only the spot owner can add new image",
        status: 401,
      });
    }
  }
});

//EDIT SPOT
router.put("/:spotId", requireAuth, async (req, res, next) => {
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
      message: "Operation failed. Must be owner of the spot in order to edit",
      statusCode: 401,
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
    res.status(401);
    res.json({
      message:
        "Operation failed. The current user must be the owner of the spot",
      statusCode: 401,
    });
  }
});

//get reviews based off spotid
router.get("/:id/reviews", async (req, res) => {
  let spot = Spot.findByPk(req.params.id);
  if (!spot) {
    res.status(404).json({ message: "Spot couldnt be found", statusCode: 404 });
  }
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
  res.json(allReviewsSpot);
});

//post review by spotid

router.post("/:id/reviews", requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  let findspot = await Spot.findByPk(req.params.id, {
    include: { model: Review },
  });
  if (!findspot) {
    res.status(404).json({ message: "Spot couldnt be found", statusCode: 404 });
  }
  const checkReview = await Review.findOne({
    where: { userId: req.user.id },
  });
  // if (checkReview) {
  //   return res.status(403).json({
  //     message: "User already has a review for this spot",
  //     statusCode: 403,
  //   });
  // }
  let newReview = await Review.create({
    userId: req.user.id,
    spotId: Number(req.params.id),
    review: review,
    star: stars,
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
        id: ele.id,
        spotId: ele.spotId,
        userId: ele.userId,
        firstName: ele.User.firstName,
        lastName: ele.User.lastName,
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

  const currentspot = await Spot.findByPk(req.params.id, {
    include: {
      model: Booking,
    },
  });
  if (!currentspot) {
    res.status(404);
    res.json({
      message: "Spot could not be found",
      statusCode: 404,
    });
    if (currentspot.ownerId === req.user.id) {
      return res.status(403).json({ message: "Owner can't edit bookings" });
    }
  }
  if (startDate >= endDate) {
    return res.json({
      message: "Validation error",
      statusCode: 400,
      errors: ["Booking's end date cannot be before or on start date"],
    });
  }

  currentspot.Bookings.forEach((booking) => {
    let currentDate = booking.startDate.toISOString().slice(0, 10);
    if (currentDate === startDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: ["Start date or end date conflict; Existing booking"],
      });
    }
  });

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
