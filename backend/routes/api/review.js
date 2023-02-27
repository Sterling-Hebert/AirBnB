const express = require("express");
const { Model } = require("sequelize");
const { Sequelize } = require(".");
const {
  User,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
  Booking,
} = require("../../db/models");
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
const { check } = require("express-validator");
const router = express.Router();

//Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },

      {
        model: Spot.scope("reviewCurrentUserScope"),
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  for (let review of reviews) {
    const preview = await SpotImage.findOne({
      where: {
        spotId: review.Spot.id,
        preview: true,
      },
    });
    if (preview) {
      review.Spot.dataValues.previewImage = preview.url;
    } else {
      review.Spot.dataValues.previewImage = "No Image";
    }
  }

  res.json({ Reviews: reviews });
});

//add an image to a review based on reviewid

router.post("/:id/images", requireAuth, async (req, res) => {
  const findReview = await Review.findByPk(req.params.id);
  if (!findReview) {
    return res
      .status(404)
      .json({ message: "Review couldn't be found", statusCode: 404 });
  }
  if (findReview.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden", statusCode: 403 });
  }
  const amountOfImages = await ReviewImage.findAll({
    where: {
      reviewId: findReview.id,
    },
  });
  if (amountOfImages.length >= 10) {
    return res.status(403).json({
      message: "Maximum number of image for this resource was reached",
      statusCode: 403,
    });
  } else {
    const newImage = await ReviewImage.create({
      reviewId: findReview.id,
      url: req.body.url,
    });
    const postImage = {
      id: newImage.id,
      url: newImage.url,
    };
    res.json(postImage);
  }
});

//edit review

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

router.put("/:id", reviewValidation, requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  let updateReview = await Review.findByPk(req.params.id);
  if (!updateReview) {
    return res
      .status(404)
      .json({ message: "Review couldnt be found", statusCode: 404 });
  }
  if (updateReview.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden", statusCode: 403 });
  }
  updateReview.update({
    review: review,
    star: stars,
  });
  await updateReview.save();
  res.json(updateReview);
});

//delete a review

router.delete("/:id", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.id);

  if (!review) {
    res
      .status(404)
      .json({ message: "Review couldnt be found", statusCode: 404 });
  } else {
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
    await review.destroy();
    res.status(200).json({ message: "Successfully deleted", statusCode: 200 });
  }
});

module.exports = router;
