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

//Get all of the Current User's Booking

router.get("/current", requireAuth, async (req, res, next) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },

      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  for (let booking of bookings) {
    const preview = await SpotImage.findOne({
      where: {
        spotId: booking.Spot.id,
        preview: true,
      },
    });
    if (preview) {
      booking.Spot.dataValues.previewImage = preview.url;
    } else {
      booking.Spot.dataValues.previewImage = "No Image";
    }
  }

  res.json({ Bookings: bookings });
});

//edit a booking

router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    res.status(404);
    res.json({
      message: "Booking couldn't be found",
      statusCode: 404,
    });
  }

  if (booking.userId !== req.user.id) {
    res.status(401);
    res.json({
      message:
        "Operation failed. Must be owner of the booking in order to edit",
      statusCode: 401,
    });
  } else {
    const { startDate, endDate } = req.body;
    if (startDate >= endDate) {
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors: ["Booking's end date cannot be before or on start date"],
      });
    }

    booking.startDate = startDate;
    booking.endDate = endDate;

    booking.save();
    res.json(booking);
  }
});

//delete a booking

router.delete("/:id", requireAuth, async (req, res) => {
  const deletedbooking = await Booking.findByPk(req.params.id);

  if (!deletedbooking) {
    return res.json({
      message: "Booking could not be found",
      statusCode: 404,
    });
  }
  if (deletedbooking.userId !== req.user.id) {
    res.status(401);
    res.json({
      message:
        "Operation failed. Must be owner of the booking in order to edit",
      statusCode: 401,
    });
  }

  let startDate = Booking.startDate;
  if (startDate) {
    return res.json({
      massage: "Bookings that have begun can not be deleted",
      statusCode: 403,
    });
  }

  await deletedbooking.destroy();
  res.status(200).json({
    message: "Booking successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
