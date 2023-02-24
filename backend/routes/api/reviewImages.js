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

//delete a spot Images by id
router.delete("/:id", requireAuth, async (req, res) => {
  const deletedReviewImage = await ReviewImage.findByPk(req.params.id);
  if (!deletedReviewImage) {
    return res.json({
      message: "Image could not be found (invalid id)",
      statusCode: 404,
    });
  }
  const review = await Review.findOne({
    where: {
      id: deletedReviewImage.reviewId,
    },
  });
  if (review.userId !== req.user.id) {
    res.status(401);
    res.json({
      message:
        "Operation failed. Must be owner of the booking in order to edit",
      statusCode: 401,
    });
  } else {
    await deletedReviewImage.destroy();
    res.status(200).json({
      message: "Image successfully deleted",
      statusCode: 200,
    });
  }
});

module.exports = router;
