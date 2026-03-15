const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { protect, adminOnly } = require('../middleware/auth');

// Store file in memory (we'll convert to base64 and save to MongoDB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WEBP, GIF allowed'));
  },
});

// Image model - stores base64 in MongoDB
const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
  filename:  { type: String, required: true },
  mimetype:  { type: String, required: true },
  size:      { type: Number },
  data:      { type: String, required: true }, // base64 string
  uploadedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

// POST /api/upload/image
router.post('/image', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Convert buffer to base64
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    // Save to MongoDB
    const image = await Image.create({
      filename:   req.file.originalname,
      mimetype:   req.file.mimetype,
      size:       req.file.size,
      data:       dataUrl,
      uploadedBy: req.user._id,
    });

    // Return the image id so we can fetch it via /api/upload/image/:id
    const url = `${process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`}/api/upload/image/${image._id}`;

    res.json({ url, publicId: image._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/upload/image/:id  — serve the image from MongoDB
router.get('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // Parse the data URL
    const matches = image.data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ message: 'Invalid image data' });

    const buffer = Buffer.from(matches[2], 'base64');
    res.set('Content-Type', matches[1]);
    res.set('Content-Length', buffer.length);
    res.set('Cache-Control', 'public, max-age=31536000'); // cache 1 year
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/upload/image/:id
router.delete('/image/:id', protect, adminOnly, async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/upload/images — list all uploaded images (admin)
router.get('/images', protect, adminOnly, async (req, res) => {
  try {
    const images = await Image.find().select('-data').sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
