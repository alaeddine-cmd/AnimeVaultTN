const express = require("express");
const User = require("../model/model");
const jwt = require("jsonwebtoken");
const userValidation = require("../validation/validation");
const bcrypt = require("bcrypt");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.inscription = (req, res) => {
  //** recuperer les données */
  const { body } = req;

  //** Valider les données */
  const { error } = userValidation(body).userValidationSignUp;
  if (error) return res.status(401).json(error.details[0].message);

  //** Hash du mot de passe */
  bcrypt
    .hash(body.password, 10)
    .then((hash) => {
      if (!hash) return res.status(500).json({ message: "Server Error !" });
      delete body.password;
      new User({ ...body, password: hash })
        .save()
        .then(() => res.status(201).json({ message: "User Created !" }))
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.connexion = (req, res) => {
  const { email, password } = req.body;

  /** Valider les données */
  const { error } = userValidation(req.body).userValidationLogin;
  if (error) return res.status(401).json(error.details[0].message);

  /** Trouver le user dans la base de données */
  User.findOne({ email: email })
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      //** Vérification du mot de passe */
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match)
            return res.status(500).json({ message: "Server Error !" });
          res.status(200).json({
            email: user.email,
            id: user._id,
            token: jwt.sign({ id: user._id }, "SECRET_KEY"),
          });
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};
