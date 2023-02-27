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
      message: "Review Image couldn't be found",
      statusCode: 404,
    });
  }
  const review = await Review.findOne({
    where: {
      id: deletedReviewImage.reviewId,
    },
  });

  //owner check
  if (review.userId !== req.user.id) {
    res.status(403);
    res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  } else {
    await deletedReviewImage.destroy();
    res.status(200).json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  }
});

module.exports = router;
