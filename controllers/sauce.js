const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    image: `${req.protocol}://localhost:4200/../backend/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
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
        image: `${req.protocol}://${req.get("host")}/images/${
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
