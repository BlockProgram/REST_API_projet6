const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,

      // My random secret generation method
      `"${Math.floor(Math.random() * 1e30)}"`
    );
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Identifiant utilisateur (ID) invalide";
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error("Requête invalide") });
  }
};
