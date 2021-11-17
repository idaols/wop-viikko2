"use strict";
// catController

const { getAllCats, getCat, addCat, modifyCat, deleteCat } = require("../models/catModel");
const { httpError } = require("../utils/errors");
const { validationResult } = require("express-validator");


const cat_list_get = async (req, res, next) => {
  try {
    const cats = await getAllCats(next);
    if (cats.length > 0) {
      res.json(cats);
    } else {
      next(httpError('No cats found', 404));
    }
  } catch (e) {
    console.log('cat_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_get = async (req, res, next) => {
  try {
    const vastaus = await getCat(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError('No cat found', 404));
    }
  } catch (e) {
    console.log('cat_get error', e.message);
    next(httpError('internal server error', 500));
  }
};


const cat_post = async (req, res, next) => {
  console.log('cat_post', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('cat_post validation', errors.array());
    next(httpError('Invalid data', 400));
    return;
  }
  if (!req.file) {
    const err = httpError('File not valid', 400);
    next(err);
    return;
  }
  try {
    console.log('Lomakkeesta', req.body);
    const { name, birthdate, weight } = req.body;
    const tulos = await addCat(name, weight, req.user.user_id, req.file.filename, birthdate, next);
    if (tulos.affectedRows > 0) {
      res.json({
        message: "cat added",
        cat_id: tulos.insertId,
      });
    } else {
      next(httpError('No cat inserted', 400));
    }
  } catch (e) {
    console.log('cat_post error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_put = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('cat_put validation', errors.array());
    next(httpError('Invalid data', 400));
    return;
  }
  try {
    console.log('cat_put', req.body);
    const { name, birthdate, weight } = req.body;
    const tulos = await modifyCat(name, weight, req.user.user_id, birthdate, req.params.id, next);
    if (tulos.affectedRows > 0) {
      res.json({
        message: "cat modified",
        cat_id: tulos.insertId,
      });
    } else {
      next(httpError('No cat modified', 400));
    }
  } catch (e) {
    console.log('cat_put error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_delete = async (req, res, next) => {
  try {
    const vastaus = await deleteCat(req.params.id, req.user.user_id, req.user.role, next);
    if (vastaus.affectedRows > 0) {
      res.json({
        message: "cat deleted",
        cat_id: vastaus.insertId,
      });
    } else {
      next(httpError('No cat found', 404));
    }
  } catch (e) {
    console.log('cat_delete error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  cat_list_get,
  cat_get,
  cat_post,
  cat_put,
  cat_delete,
};
