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
  const deletedImage = await SpotImage.findByPk(req.params.id, {
    where: { spotId: req.user.id },
  });

  if (!deletedImage) {
    return res.json({
      message: "Spot Image couldn't be found",
      statusCode: 404,
    });
  }
  const user = await Spot.findByPk(deletedImage.dataValues.spotId, {
    attributes: ["ownerId"],
  });

  if (user.ownerId !== req.user.id) {
    res.status(401);
    res.json({
      message:
        "Operation failed. Must be owner of the booking in order to edit",
      statusCode: 401,
    });
  } else {
    await deletedImage.destroy();
    res.status(200).json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  }
});

module.exports = router;
