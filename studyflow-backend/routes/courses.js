const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');
const multer = require('multer');
const path = require('path');

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Add course with notes
router.post('/add', (req, res) => {
  const { title, description, notes } = req.body;
  const newCourse = { title, description, notes };

  Course.create(newCourse, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Course.'
      });
    } else res.send(data);
  });
});

// Upload course resource
router.post('/upload-resource/:courseId', upload.single('resource'), (req, res) => {
  const courseId = req.params.courseId;
  const resourceUrl = req.file.path;

  Course.addResource(courseId, resourceUrl, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while uploading the resource.'
      });
    } else res.send(data);
  });
});

module.exports = router;
