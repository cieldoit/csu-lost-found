const Claim = require("../models/Claim");
const Item = require("../models/Item");
const Notification = require("../models/Notification");

exports.createClaim = async (req, res) => {
  try {
    const { itemId, proofDescription } = req.body;

    // Check if the item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if a claim already exists for this exact user and item
    const existingClaim = await Claim.findOne({ item: itemId, claimant: req.user.id });
    if (existingClaim) {
      return res.status(400).json({ message: "You have already submitted a claim for this item" });
    }

    // Create the new claim document
    const claim = await Claim.create({
      item: itemId,
      claimant: req.user.id,
      proofDescription
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveClaim = async (req, res) => {
  try {
    const claimId = req.params.id;

    const claim = await Claim.findById(claimId).populate("item");
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Update claim status
    claim.status = "approved";
    await claim.save();

    // Update the corresponding item status
    const item = await Item.findById(claim.item._id);
    if (item) {
      item.status = "claimed";
      await item.save();
    }

    // Create Notification
    await Notification.create({
      user: claim.claimant,
      message: `Your claim for "${claim.item?.title || 'an item'}" has been approved.`
    });

    res.json({ message: "Claim approved successfully", claim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectClaim = async (req, res) => {
  try {
    const claimId = req.params.id;

    const claim = await Claim.findById(claimId).populate("item");
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Update claim status
    claim.status = "rejected";
    await claim.save();

    // Create Notification
    await Notification.create({
      user: claim.claimant,
      message: `Your claim for "${claim.item?.title || 'an item'}" has been rejected. Please provide stronger proof of ownership.`
    });

    res.json({ message: "Claim rejected successfully", claim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("item")
      .populate("claimant", "fullName email")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
