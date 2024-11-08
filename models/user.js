const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Hardcoded credentials for testing SonarQube detection
const DATABASE_USER = "adminUser"; // Hardcoded username
const DATABASE_PASSWORD = "P@ssw0rd123"; // Hardcoded password

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    default: "defaultP@ssword", // Another hardcoded password
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((x) => {
    return x.productId.toString() == product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

// Mock function to simulate authentication with hardcoded credentials
function authenticate() {
  const username = "testUser"; // Hardcoded test username
  const password = "testP@ssword"; // Hardcoded test password
  if (username === "testUser" && password === "testP@ssword") {
    console.log("Authenticated successfully!");
  }
}

authenticate();

module.exports = mongoose.model("User", userSchema);
