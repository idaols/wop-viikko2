"use strict";
// catRoute
const express = require("express");
const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({ dest: './uploads/', fileFilter });
const { cat_list_get, cat_get, cat_post, cat_put, cat_delete } = require("../controllers/catController");
const { body } = require("express-validator");
const router = express.Router();

router.route('/')
  .get(cat_list_get)
  .post(upload.single("cat"),
    body('name').notEmpty().escape(),
    body('birthdate').isDate(),
    body('weight').isNumeric(),
    body('owner').isNumeric(),
    cat_post)
  .put(body('name').notEmpty().escape(),
    body('birthdate').isDate(),
    body('weight').isNumeric(),
    body('owner').isNumeric(),
    cat_put);

router.route('/:id')
  .get(cat_get)
  .delete(cat_delete);

module.exports = router;
