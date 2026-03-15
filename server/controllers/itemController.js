const Item = require("../models/Item");

exports.createItem = async (req, res) => {

  try {
    const {
      title,
      description,
      category,
      type,
      locationLost,
      locationFound
    } = req.body;

    const images = req.files?.map(file => file.path);
    
    const item = await Item.create({
      title,
      description,
      category,
      type,
      locationLost,
      locationFound,
      images,
      reportedBy: req.user.id
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLostItems = async (req, res) => {
  try {
    const items = await Item.find({ type: "lost" })
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFoundItems = async (req, res) => {
  try {
    const items = await Item.find({ type: "found" })
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const { q, category, status, type } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;
    if (type) query.type = type;

    const items = await Item.find(query)
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "fullName");
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};