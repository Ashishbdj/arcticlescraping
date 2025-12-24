const Article = require("./Article");

exports.getAll = async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
};

exports.getOne = async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.json(article);
};

exports.create = async (req, res) => {
  const article = await Article.create(req.body);
  res.status(201).json(article);
};

exports.update = async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(article);
};

exports.delete = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};