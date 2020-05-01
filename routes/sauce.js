const express = require("express");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const router = express.Router();
const sauceCtlr = require("../controllers/sauce");

router.post("/", auth, multer, sauceCtlr.createSauce);
router.post("/:id/like", auth, sauceCtlr.likeSauce);
router.get("/", auth, sauceCtlr.getAllSauces);
router.get("/:id", auth, sauceCtlr.getOneSauce);
router.put("/:id", auth, multer, sauceCtlr.modifySauce);
router.delete("/:id", auth, sauceCtlr.deleteSauce);

module.exports = router;
