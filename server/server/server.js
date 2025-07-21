

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

mongoose.connect("mongodb+srv://ambpcs123:pcs%40123@cluster0.mfryutx.mongodb.net/glb_models", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
