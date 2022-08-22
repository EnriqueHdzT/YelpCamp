const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router
    .route("/")
    .get(asyncWrap(campgrounds.index))
    .post(
        isLoggedIn,
        validateCampground,
        asyncWrap(campgrounds.createCampground)
    );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
    .route("/:id")
    .get(asyncWrap(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthor,
        validateCampground,
        asyncWrap(campgrounds.updateCampground)
    )
    .delete(isLoggedIn, isAuthor, asyncWrap(campgrounds.deleteCampground));

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    asyncWrap(campgrounds.renderEditForm)
);

module.exports = router;
