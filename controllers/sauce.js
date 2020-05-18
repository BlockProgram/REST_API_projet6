const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  console.log(req.file);
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

// exports.likeSauce = (req, res, next) => {
//   // User likes
//   if (req.body.like === 1) {
//     Sauce.updateOne(
//       { _id: req.params.id },
//       {
//         $addToSet: { usersLiked: req.body.userId },
//       }
//     )
//       .then(() => res.status(200).json({ message: "User liked ajouté " }))
//       .catch((error) => res.status(400).json({ error }));
//     setTimeout(updateCounts, 500);
//     // User dislikes
//   } else if (req.body.like === -1) {
//     Sauce.updateOne(
//       { _id: req.params.id },
//       {
//         $addToSet: { usersDisliked: req.body.userId },
//       }
//     )
//       .then(() => res.status(200).json({ message: "User disliked ajouté" }))
//       .catch((error) => res.status(400).json({ error }));
//     setTimeout(updateCounts, 500);
//     // User removes like/dislike
//   } else if (req.body.like === 0) {
//     Sauce.updateOne(
//       { _id: req.params.id },
//       {
//         $pull: { usersLiked: req.body.userId, usersDisliked: req.body.userId },
//       }
//     )
//       .then(() => res.status(200).json({ message: "Vote modifié" }))
//       .catch((error) => res.status(400).json({ error }));
//     setTimeout(updateCounts, 500);
//   }

//   //Update likes/dislikes numbers
//   function updateCounts() {
//     Sauce.findOne({ _id: req.params.id }).then((sauce) => {
//       console.log(`likes: ${sauce.usersLiked.length}`);
//       console.log(`dislikes: ${sauce.usersDisliked.length}`);
//       Sauce.updateOne(
//         { _id: req.params.id },
//         {
//           likes: `${sauce.usersLiked.length}`,
//           dislikes: `${sauce.usersDisliked.length}`,
//         }
//       )

//         .then(() => console.log("success"))
//         .catch((error) => console.error(error));
//     });
//   }
// };

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
            sauce.usersliked = sauce.usersLiked.filter(
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
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée " }))
    .catch((error) => res.status(400).json({ error }));
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
