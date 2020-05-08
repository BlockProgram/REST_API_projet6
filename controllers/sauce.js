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
  // SEE BELOW
  // https://docs.mongodb.com/manual/reference/operator/update/pull/#up._S_pull
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let likeUsers = Array.from(sauce.usersLiked);
      let dislikeUsers = Array.from(sauce.usersDisliked);
      if ((req.body.like = 1)) {
        likeUsers.push(req.body.userId);
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            usersLiked: likeUsers,
          }
        )
          .then(() => res.status(200).json({ message: "Like appliqué " }))
          .catch((error) => res.status(400).json({ error }));
      } else if ((req.body.like = -1)) {
        dislikeUsers.push(req.body.userId);
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: 1 }, usersDisliked: dislikeUsers }
        )
          .then(() => res.status(200).json({ message: "Dislike appliqué" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));

  //   Définit le statut "j'aime" pour userID fourni. Si j'aime = 1, l'utilisateur aime la sauce.
  // Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. Si j'aime = -1,
  // l'utilisateur n'aime pas la sauce. L'identifiant de l'utilisateur doit être ajouté
  // ou supprimé du tableau approprié, en gardant une trace de ses préférences et en
  // l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total
  //  de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
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
