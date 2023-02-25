const express = require("express");
const User = require("../model/model");
const Profile = require("../model/profileModel");
const jwt = require("jsonwebtoken");
const userValidation = require("../validation/validation");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

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
    .then(async (hash) => {
      if (!hash) return res.status(500).json({ message: "Server Error !" });
      delete body.password;
      const newUser = new User({ ...body, password: hash });
      await newUser
        .save()
        .then(() => res.status(201).json({ message: "User Created !" }))
        .catch((error) => res.status(500).json(error));

      const newProfile = new Profile({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      });
      await newProfile.save();
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

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.send_email = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = jwt.sign({ id: user._id }, "SECRET_KEY");

    const link = `http://localhost:3000/${user._id}/${token}`;
    await sendEmail(user.email, "Password reset", link);

    res.status(200).send("password reset link sent to your email account");
  } catch (error) {
    res.status(501).send("An error occured");
    console.log(error);
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.resetPassword = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = jwt.sign({ id: user._id }, "SECRET_KEY");
    if (!token) return res.status(400).send("Invalid link or expired");

    const newpass = await bcrypt.hash(req.body.password, 10);

    user.password = newpass;

    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.resetPasswordFromApp = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });

    const newpass = await bcrypt.hash(req.body.password, 10);

    user.password = newpass;

    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.resetUsername = async (req, res) => {
  await User.findOneAndUpdate(
    { email: req.body.email },
    { username: req.body.username }
  )
    .then(async () => {
      await Profile.findOneAndUpdate(
        { email: req.body.email },
        { username: req.body.username }
      )
        .then(() => {
          return res.status(200).json({ message: "Username changed" });
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};
