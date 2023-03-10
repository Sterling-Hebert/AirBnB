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

//Get all of the Current User's Booking

router.get("/current", requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Spot.scope("reviewCurrentUserScope"),
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
    ],
  });


  //added preview variable
  const previewImage =
    Spot.SpotImages > 0 ? Spot.SpotImages[0].url : "No preview Image";


    //checks for each preview
  bookings.forEach((booking) => {
    const previewPic = SpotImage.findOne({
      where: { spotId: booking.Spot.id, preview: true },
    });
    if (previewPic) {
      booking.Spot.dataValues.previewImage = previewPic.url;
    } else {
      booking.Spot.dataValues.previewImage = "No Preview Image";
    }
  });

  return res.json({ Bookings: bookings, previewImage });
});

//edit a booking

router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    res.status(404);
    res.json({
      message: "Booking couldn't be found",
      statusCode: 404,
    });
  }

  //past date check
  let today = new Date();
  if (booking.endDate < today) {
    res.status(403);
    return res.json({
      message: "Past bookings can't be modified",
      statusCode: 403,
    });
  }
//owner check
  if (booking.userId !== req.user.id) {
    res.status(403);
    res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  } else {

    //start date check
    if (startDate >= endDate) {
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors: ["endDate cannot come before startDate"],
      });
    }
    const spotId = booking.dataValues.id;
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
          {
            startDate: { [Op.lte]: startDate },
            endDate: { [Op.gte]: endDate },
          },
        ],
      },
    });
    //if error has length, throw error
    if (existingBookings.length) {
      let conflictTimeError = {
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: {},
      };
      conflictTimeError.errors = {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      };
      res.json({ conflictTimeError });
    }

    let today = new Date();
    if (booking.endDate < today) {
      res.status(403);
      return res.json({
        message: "Past bookings can't be modified",
        statusCode: 403,
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
    res.status(403);
    res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  let today = new Date();
  let startDate = deletedbooking.startDate;
  if (startDate < today) {
    return res.json({
      massage: "Bookings that have begun can not be deleted",
      statusCode: 403,
    });
  }

  await deletedbooking.destroy();
  res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
