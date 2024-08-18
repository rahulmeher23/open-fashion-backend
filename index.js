const express = require("express");
const admin = require("firebase-admin");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://open-fashion-b648c.firebaseio.com",
});

const db = admin.firestore();
const auth = admin.auth();

// Get products
app.get("/products", async (req, res) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).send("No products found.");
    }

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.send(products);
  } catch (error) {
    res.status(500).send("Error fetching products: " + error.message);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
