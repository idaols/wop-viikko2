"use strict";
// userController

const { getAllUsers, getUser, addUser } = require("../models/userModel");
const { httpError } = require("../utils/errors");


const user_list_get = async (req, res, next) => {
  try {
    const users = await getAllUsers(next);

    if (users.length > 0) {
      res.json(users);
    } else {
      next(httpError('No users found', 404));
    }
  } catch (e) {
    console.log('user_list_get error', e.message);
    next(httpError('internal server error', 500));
  }

};

const user_get = async (req, res, next) => {
  const vastaus = getUser(req.params.id);
  delete vastaus.password;
  try {
    const vastaus = await getUser(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_post = async (req, res, next) => {
  try {
    console.log('Lomakkeesta', req.body);
    const { name, email, password } = req.body;
    const tulos = await addUser(name, email, password, next);
    if (tulos.affectedRows > 0) {
      res.json({
        message: "user added",
        user_id: tulos.insertId,
      });
    } else {
      next(httpError('No user inserted', 400));
    }
  } catch (e) {
    console.log('user_get error', e.message);
    next(httpError('internal server error', 500));
  }

};

module.exports = {
  user_list_get,
  user_get,
  user_post,
};
