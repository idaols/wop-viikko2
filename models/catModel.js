"use strict";
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllCats = async (next) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute('SELECT * FROM wop_cat');
    return rows;
  } catch (e) {
    console.error('getAllCats error', e.message);
    next(httpError('Database error', 500));
  }
};

//Funktio, joka palauttaa yhden kissan id:n perusteella
const getCat = async (id, next) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute('SELECT * FROM wop_cat WHERE cat_id = ?', [id]);
    return rows;
  } catch (e) {
    console.error('getCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const addCat = async (name, weight, owner, filename, birthdate, next) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO wop_cat (name, weight, owner, filename, birthdate) VALUES (?, ?, ?, ?, ?)', [name, weight, owner, filename, birthdate]);
    return rows;
  } catch (e) {
    console.error('addCat error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  getAllCats,
  getCat,
  addCat,
};
