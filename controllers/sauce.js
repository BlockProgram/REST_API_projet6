const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  const inputRegex = /^[a-zA-Z0-9\s]+$/;
  if (
    inputRegex.test(sauce.name.trim()) &&
    inputRegex.test(sauce.manufacturer.trim()) &&
    inputRegex.test(sauce.description.trim()) &&
    inputRegex.test(sauce.mainPepper.trim())
  ) {
    sauce
      .save()
      .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res
      .status(201)
      .json({ message: "Entrez uniquement des lettres et des chiffres" });
  }
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        case -1:
          sauce.dislikes = sauce.dislikes + 1;
          sauce.usersDisliked.push(req.body.userId);
          sauceObject = {
            dislikes: sauce.dislikes,
            usersDisliked: sauce.usersDisliked,
          };
          break;
        case 0:
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            sauce.usersDisliked = sauce.usersDisliked.filter(
              (user) => user !== req.body.userId
            );
            sauce.dislikes = sauce.dislikes - 1;
            sauceObject = {
              dislikes: sauce.dislikes,
              usersDisliked: sauce.usersDisliked,
            };
          } else {
            sauce.usersLiked = sauce.usersLiked.filter(
              (user) => user !== req.body.userId
            );
            sauce.likes = sauce.likes - 1;
            sauceObject = {
              likes: sauce.likes,
              usersLiked: sauce.usersLiked,
            };
          }
          break;
        case 1:
          sauce.likes = sauce.likes + 1;
          sauce.usersLiked.push(req.body.userId);
          sauceObject = {
            likes: sauce.likes,
            usersLiked: sauce.usersLiked,
          };
          break;
        default:
          return res.status(500).json({ error: "Bad request" });
          break;
      }
      Sauce.updateOne({ _id: req.params.id }, { $set: sauceObject })
        .then(() => res.status(200).json({ message: "Sauce updated" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch(() => res.status(400).json({ error: "Sauce not found" }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  const inputRegex = new RegExp("^[a-zA-Z0-9s]+$");
  if (
    inputRegex.test(sauceObject.name.trim()) &&
    inputRegex.test(sauceObject.manufacturer.trim()) &&
    inputRegex.test(sauceObject.description.trim()) &&
    inputRegex.test(sauceObject.mainPepper.trim())
  ) {
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée " }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res
      .status(201)
      .json({ message: "Entrez uniquement des lettres et des chiffres" });
  }
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce effacée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
