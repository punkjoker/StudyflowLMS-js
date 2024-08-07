const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studyflow'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});
// Student Signup
app.post('/api/auth/signup/student', (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const query = 'INSERT INTO students (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';

  db.execute(query, [first_name, last_name, email, password, 'student'], (err, result) => {
    if (err) {
      res.status(500).send('Error inserting student into the database');
    } else {
      res.status(200).send({ message: 'Student signed up successfully' });
    }
  });
});

// Fetch assignments for a student based on enrolled courses
app.get('/api/student/assignments', (req, res) => {
  const studentId = req.query.student_id;
  if (!studentId) {
    console.log('Student ID is missing');
    return res.status(400).send('Student ID is required');
  }

  const query = `
    SELECT assignments.id, assignments.title, assignments.description, assignments.due_date, courses.title AS course_title
    FROM assignments
    JOIN courses ON assignments.course_id = courses.id
    JOIN enrollments ON courses.id = enrollments.course_id
    WHERE enrollments.student_id = ?
  `;

  db.execute(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err); // Log the error details
      res.status(500).send('Error fetching assignments');
    } else {
      if (results.length === 0) {
        console.log('No assignments found for student ID:', studentId);
      } else {
        console.log('Assignments fetched:', results); // Log the fetched results
      }
      res.status(200).send(results);
    }
  });
});

// Instructor Signup
app.post('/api/auth/signup/instructor', (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const query = 'INSERT INTO instructors (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';

  db.execute(query, [first_name, last_name, email, password, 'instructor'], (err, result) => {
    if (err) {
      res.status(500).send('Error inserting instructor into the database');
    } else {
      res.status(200).send({ message: 'Instructor signed up successfully' });
    }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const studentQuery = 'SELECT id, role FROM students WHERE email = ? AND password = ?';
  db.execute(studentQuery, [email, password], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching student data');
    } else if (results.length > 0) {
      const user = results[0];
      res.status(200).send({ message: 'Login successful', id: user.id, role: user.role });
      return;
    }

    const instructorQuery = 'SELECT id, role FROM instructors WHERE email = ? AND password = ?';
    db.execute(instructorQuery, [email, password], (err, results) => {
      if (err) {
        res.status(500).send('Error fetching instructor data');
      } else if (results.length > 0) {
        const user = results[0];
        res.status(200).send({ message: 'Login successful', id: user.id, role: user.role });
      } else {
        res.status(401).send({ message: 'Invalid email or password' });
      }
    });
  });
});

// Fetch User Data for Students and Instructors
app.get('/api/auth/user/student', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM students WHERE id = ?';

  db.execute(query, [userId], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching student data');
    } else if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      res.status(404).send('Student not found');
    }
  });
});

app.get('/api/auth/user/instructor', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM instructors WHERE id = ?';

  db.execute(query, [userId], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching instructor data');
    } else if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      res.status(404).send('Instructor not found');
    }
  });
});

// Update Profile for Students and Instructors
app.put('/api/auth/user/student', (req, res) => {
  const { id, first_name, last_name, email } = req.body;
  const query = 'UPDATE students SET first_name = ?, last_name = ?, email = ? WHERE id = ?';

  db.execute(query, [first_name, last_name, email, id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating student data');
    } else {
      res.status(200).send({ message: 'Student profile updated successfully' });
    }
  });
});

app.put('/api/auth/user/instructor', (req, res) => {
  const { id, first_name, last_name, email } = req.body;
  const query = 'UPDATE instructors SET first_name = ?, last_name = ?, email = ? WHERE id = ?';

  db.execute(query, [first_name, last_name, email, id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating instructor data');
    } else {
      res.status(200).send({ message: 'Instructor profile updated successfully' });
    }
  });
});

// Add and Fetch Courses
app.post('/api/courses', (req, res) => {
  const { title, description, instructor_id, notes } = req.body;
  const query = 'INSERT INTO courses (title, description, instructor_id, notes) VALUES (?, ?, ?, ?)';

  db.execute(query, [title, description, instructor_id, notes], (err, result) => {
    if (err) {
      res.status(500).send('Error inserting course into the database');
    } else {
      res.status(200).send({ message: 'Course added successfully' });
    }
  });
});

app.get('/api/courses', (req, res) => {
  const query = 'SELECT * FROM courses';

  db.execute(query, [], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching courses from the database');
    } else {
      res.status(200).send(results);
    }
  });
});

app.get('/api/instructor/courses', (req, res) => {
  const instructorId = req.query.instructor_id;
  const query = 'SELECT * FROM courses WHERE instructor_id = ?';

  db.execute(query, [instructorId], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching courses');
    } else {
      res.status(200).send(results);
    }
  });
});

app.get('/api/courses/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  const query = 'SELECT * FROM courses WHERE id = ?';

  db.execute(query, [courseId], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching course');
    } else if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      res.status(404).send('Course not found');
    }
  });
});

// Fetch enrolled courses for a specific student
app.get('/api/enrollments/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`Fetching enrollments for user ID: ${userId}`);

  const query = `
    SELECT enrollments.id, enrollments.course_id, enrollments.student_id, enrollments.enrollment_date,
           courses.title, courses.description
    FROM enrollments
    JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.student_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching enrolled courses:', err); // Log the error details
      res.status(500).json({ error: 'An error occurred while fetching enrolled courses.' });
    } else {
      console.log('Fetched enrolled courses:', results); // Log the fetched results
      res.json(results);
    }
  });
});


// File Upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.status(200).send({ filePath: req.file.path });
});

// Fetch and Upload Assignments
app.post('/api/assignments', (req, res) => {
  const { title, description, due_date, course_id } = req.body;
  const query = 'INSERT INTO assignments (title, description, due_date, course_id) VALUES (?, ?, ?, ?)';

  db.execute(query, [title, description, due_date, course_id], (err, result) => {
    if (err) {
      res.status(500).send('Error inserting assignment into the database');
    } else {
      res.status(200).send({ message: 'Assignment added successfully' });
    }
  });
});

app.get('/api/instructor/assignments', (req, res) => {
  const instructorId = req.query.instructor_id;
  const query = `
    SELECT assignments.id, assignments.title, assignments.description, assignments.due_date, courses.title AS course_title
    FROM assignments
    JOIN courses ON assignments.course_id = courses.id
    WHERE courses.instructor_id = ?
  `;

  db.execute(query, [instructorId], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching assignments');
    } else {
      res.status(200).send(results);
    }
  });
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
