import foodModel from "../models/foodModel.js";
import fs from "fs"

// helper function to contruct image URL
// const constructImageUrl = (imageName) => {
//   const filename = imageName.split(/(food_\d+\.png)$/)[1];
//   return `/assets/${filename}`;
// }

// add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename
  })
  try {
    await food.save();
    res.json({ success: true, message: "Food added!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while saving the product" })
  }
}

// list all food
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    const updatedFoods = foods.map(food => {
      const updatedFood = {
        ...food._doc, // spread the existing fields
        image: constructImageUrl(food.image) // modify image field to include the correct url
      }
      process.stdout.write(`Transformed Food Item: ${JSON.stringify(updatedFood)}\n`);
      // console.log("transformed foor item", updatedFood);
      return updatedFood;
    })
    res.json({ success: true, data: updatedFoods })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while getting the food models"})
  }
}

// remove food item
const removeFood = async (req,res) => {
  try {
    // first find food item to delete & save in variable
    const food = await foodModel.findById(req.body.id);
    // then remove img from local folder
    fs.unlink(`uploads/${food.image}`, () => {})
    // then delete item from db
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed"});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error});
  }
}

export { addFood, listFood, removeFood }
