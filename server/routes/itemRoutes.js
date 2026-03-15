const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  getRecentItems,
  getLostItems,
  getFoundItems,
  getItemById
} = require("../controllers/itemController");

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  createItem
);

router.get("/", getItems);
router.get("/recent", getRecentItems);
router.get("/lost", getLostItems);
router.get("/found", getFoundItems);
router.get("/:id", getItemById);

module.exports = router;