const express = require("express");
const router = express.Router({ mergeParams: true });

const asyncWrap = require("../utils/asyncWrap");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", validateReview, isLoggedIn, asyncWrap(reviews.createReview));

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    asyncWrap(reviews.deleteReview)
);

module.exports = router;
