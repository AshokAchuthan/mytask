const mongoose = require('mongoose');

// Define the schema for Electronics Subcategories
const subcategorySchema = new mongoose.Schema({
  name: String,
  products: [String],
});

// Define the schema for the Electronics category
const electronicsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  subcategories: [subcategorySchema],
});



// Define a Mongoose Model for Electronics
const Categorys = mongoose.model('lists', electronicsSchema);


module.exports = Categorys;
