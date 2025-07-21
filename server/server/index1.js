const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());
app.use('/model', express.static(path.join(__dirname, 'uploads'))); 


mongoose.set('debug', true);


mongoose.connect('mongodb+srv://ambpcs123:pcs%40123@cluster0.mfryutx.mongodb.net/glb_models', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(' MongoDB connection error:', err));


const modelSchema = new mongoose.Schema({
  filename: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Model = mongoose.model('Model', modelSchema); 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });


app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  console.log('📦 Received file:', req.file);

  try {
    const model = new Model({ filename: req.file.filename });
    await model.save();
    console.log('Saved to DB:', model);
    res.json({ success: true, model });
  } catch (err) {
    console.error('Error saving to DB:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/models', async (req, res) => {
  try {
    const models = await Model.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (err) {
    console.error('Error fetching models:', err);
    res.status(500).json({ success: false });
  }
});


app.get('/model/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send(' File not found');
  }
});


app.delete('/model/:id', async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    if (model) {
      const filePath = path.join(__dirname, 'uploads', model.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error(' File deletion error:', err);
      });
      await model.deleteOne();
      console.log(' Deleted model and file:', model.filename);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Model not found' });
    }
  } catch (err) {
    console.error(' Delete error:', err);
    res.status(500).json({ success: false });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
