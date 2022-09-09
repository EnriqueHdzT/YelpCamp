const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
    .route("/")
    .get(asyncWrap(campgrounds.index))
    .post(
        isLoggedIn,
        upload.array("image"),
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
        upload.array("image")
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
