const Sauce = require("../models/sauce");

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
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  // User likes
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $addToSet: { usersLiked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "User liked ajouté " }))
      .catch((error) => res.status(400).json({ error }));

    // User dislikes
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $addToSet: { usersDisliked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "User disliked ajouté" }))
      .catch((error) => res.status(400).json({ error }));

    // User removes like/dislike
  } else if (req.body.like === 0) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $pull: { usersLiked: req.body.userId, usersDisliked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "Vote modifié" }))
      .catch((error) => res.status(400).json({ error }));
  }

  //Update likes/dislikes numbers
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    console.log(`likes: ${sauce.usersLiked.length}`);
    console.log(`dislikes: ${sauce.usersDisliked.length}`);
    Sauce.updateOne(
      { _id: req.params.id },
      {
        likes: `${sauce.usersLiked.length}`,
        dislikes: `${sauce.usersDisliked.length}`,
      }
    )

      .then(() => console.log("success"))
      .catch((error) => console.error(error));
  });
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
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée " }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce effacée" }))
    .catch((error) => res.status(400).json({ error }));
};
