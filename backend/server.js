const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Categorys = require('./model/CategorySchema');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ashokachuz1111:LAJNamWS2xFw4r7U@cluster0.80ixiao.mongodb.net/category?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




// Retrieve all categories
app.get('/api/categories', async (req, res) => {
  try {
    console.log(Categorys.find());
    const allproducts = await Categorys.find()
    console.log(allproducts);
    res.json(allproducts)
  }
  catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


});

// Create a new category
app.post('/api/categories', async (req, res) => {
  try {

    const { name, subcategories } = req.body;
    console.log(req.body)
    const newCategory = new Categorys({ name, "subcategories":[subcategories], products: [] });
    console.log(newCategory)
    const updateddata = await newCategory.save()
    if (updateddata) {
      res.status(200).json(updateddata)
      
    }
    else {
      res.status(404).json({ error: 'Category not found' });
    }
  }
  catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add a subcategoriy to a category
app.post('/api/products/:categoryName', async (req, res) => {
  try {
    const { productName, categoryName } = req.body;

    // Find the Electronics category by name
    const category = await Categorys.findOne({ name: categoryName });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      // Add the productName to the subcategories of the Electronics category
      category.subcategories.push({ name: productName, products: [] });

      // Save the updated Electronics category
      const updatedCategory = await category.save();

      res.status(200).json(updatedCategory);
    }
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//addproduct
app.post('/api/listing/:categoryName/:subcategoryName', async (req, res) => {
  try {
    const { productName } = req.body;
    const { categoryName, subcategoryName } = req.params;

    // Find the Electronics category by name
    const category = await Categorys.findOne({ name: categoryName });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      // Find the subcategory within the category
      const subcategory = category.subcategories.find(sub => sub.name === subcategoryName);

      if (!subcategory) {
        res.status(404).json({ error: 'Subcategory not found' });
      } else {
        // Add the productName to the products array of the subcategory
        if(subcategory.products.length===0){
          subcategory.products[0]=productName
        }else{
          subcategory.products.push(productName);
        }
        

        // Save the updated Electronics category
        const updatedCategory = await category.save();

        res.status(200).json(updatedCategory);
      }
    }
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Retrieve products for a specific category
app.get('/api/products/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName;

  try {
    const category = await Categorys.findOne({ name: categoryName });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json(category.subcategories);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Retrieve categories with subcategories and product counts
app.get('/api/listing', async (req, res) => {

  try {
    const subcat = await Categorys.find()
    const newsubcategory = (subcat.map(item => item.subcategories))
    res.status(200).json(newsubcategory)
  }
  catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
