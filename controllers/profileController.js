const express = require("express");
const Profile = require("../model/profileModel");
const jwt = require("jsonwebtoken");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getUser = async (req, res) => {
  await Profile.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      return res.status(200).json({
        username: user.username,
        email: user.email,
      });
    })
    .catch((error) => res.status(500).json(error));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.addHistory = async (req, res) => {
  const profileInfo = await Profile.findOne({ email: req.body.email });

  let hisIndex = profileInfo.history.findIndex(
    (his) => his.epID === req.body.newHistory.epID
  );

  const hisUpdated = profileInfo.history;
  if (hisIndex > -1) {
    await hisUpdated.splice(hisIndex, 1);
  }
  await Profile.findOneAndUpdate(
    { email: req.body.email },
    {
      history: [req.body.newHistory, ...hisUpdated],
    }
  )
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      return res.status(200).json({ message: "done !" });
    })
    .catch((error) => res.status(500).json(error));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getHistoryList = async (req, res) => {
  await Profile.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      return res.status(200).send(user.history);
    })
    .catch((error) => res.status(500).json(error));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.clearAllHistory = async (req, res) => {
  await Profile.findOneAndUpdate(
    { email: req.body.email },
    {
      history: [],
    }
  )
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      return res.status(200).json({ message: "done !" });
    })
    .catch((error) => res.status(500).json(error));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.addFavorite = async (req, res) => {
  const profileInfo = await Profile.findOne({ email: req.body.email });

  await Profile.findOneAndUpdate(
    { email: req.body.email },
    {
      favorite: [req.body.newFavorite, ...profileInfo.favorite],
    }
  )
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      return res.status(200).json({ message: "done !" });
    })
    .catch((error) => res.status(500).json(error));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getFavoriteList = async (req, res) => {
  await Profile.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      return res.status(200).send(user.favorite);
    })
    .catch((error) => res.status(500).json(error));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.removeFavorite = async (req, res) => {
  const profileInfo = await Profile.findOne({ email: req.body.email });

  let favIndex = profileInfo.favorite.findIndex(
    (fav) => fav.animeId === req.body.favorite.animeId
  );

  const favRemoved = profileInfo.favorite;
  if (favIndex > -1) {
    await favRemoved.splice(favIndex, 1);
  }
  await Profile.findOneAndUpdate(
    { email: req.body.email },
    {
      favorite: favRemoved,
    }
  )
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      return res.status(200).json({ message: "done !" });
    })
    .catch((error) => res.status(500).json(error));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.isFavorite = async (req, res) => {
  const profileInfo = await Profile.findOne({ email: req.body.email });

  let favIndex = profileInfo.favorite.findIndex(
    (fav) => fav.animeId === req.body.favorite.animeId
  );

  if (favIndex > -1) {
    return res.status(200).send(true);
  } else {
    return res.status(404).send(false);
  }
};
