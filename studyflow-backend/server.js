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

// Add a new course
app.post('/api/courses', (req, res) => {
  const { title, description, instructor_id } = req.body;

  if (!title || !description || !instructor_id) {
    return res.status(400).send('Missing required fields');
  }

  const query = 'INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)';

  db.execute(query, [title, description, instructor_id], (err, result) => {
    if (err) {
      console.error('Error inserting course into the database:', err);
      res.status(500).send('Error inserting course into the database');
    } else {
      res.status(200).send({ message: 'Course added successfully' });
    }
  });
});


// Fetch all courses
app.get('/api/courses', (req, res) => {
  const query = 'SELECT id, title, description, unit_code, instructor_id FROM courses';

  db.execute(query, [], (err, results) => {
    if (err) {
      console.error('Error fetching courses from the database:', err);
      res.status(500).send('Error fetching courses from the database');
    } else {
      res.status(200).send(results);
    }
  });
});


// Fetch courses by instructor ID
app.get('/api/instructor/courses', (req, res) => {
  const instructorId = req.query.instructor_id;

  if (!instructorId) {
    return res.status(400).send('Missing instructor_id query parameter');
  }

  const query = 'SELECT * FROM courses WHERE instructor_id = ?';

  db.execute(query, [instructorId], (err, results) => {
    if (err) {
      console.error('Error fetching courses by instructor:', err);
      res.status(500).send('Error fetching courses');
    } else {
      res.status(200).send(results);
    }
  });
});

// Fetch a specific course by ID
app.get('/api/courses/:courseId', (req, res) => {
  const courseId = req.params.courseId;

  const query = 'SELECT * FROM courses WHERE id = ?';

  db.execute(query, [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching course:', err);
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

// Add Assignments
app.post('/api/assignments', (req, res) => {
  const { course_id, title, description, due_date } = req.body;

  // Validate request body
  if (!course_id || !title || !description || !due_date) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  // Insert assignment into the database
  const query = `
    INSERT INTO assignments (course_id, title, description, due_date)
    VALUES (?, ?, ?, ?)
  `;
  db.execute(query, [course_id, title, description, due_date], (err, result) => {
    if (err) {
      console.error('Error inserting assignment into the database:', err);
      return res.status(500).send({ message: 'Error inserting assignment into the database' });
    }

    res.status(200).send({ message: 'Assignment added successfully', assignmentId: result.insertId });
  });
});

//get assigment details
app.get('/api/assignment-details/:courseId', (req, res) => {
  const courseId = req.params.courseId;

  const query = `
    SELECT 
      courses.id AS course_id, 
      courses.title AS course_title, 
      courses.description AS course_description,
      assignments.id AS assignment_id, 
      assignments.title AS assignment_title, 
      assignments.description AS assignment_description, 
      assignments.due_date AS assignment_due_date,
      questions.question_id AS question_id,
      questions.question_text AS question_text,
      questions.options AS options,  -- Fetch the options JSON
      questions.correct_answer AS correct_answer  -- Fetch the correct_answer
    FROM courses
    LEFT JOIN assignments ON courses.id = assignments.course_id
    LEFT JOIN questions ON assignments.id = questions.assignment_id
    WHERE courses.id = ?
  `;

  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching assignment details:', err);
      return res.status(500).json({ error: 'An error occurred while fetching assignment details.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No assignments found for the specified course.' });
    }

    // Process the data into the required structure
    const assignmentDetails = {
      courseId: results[0].course_id,
      courseTitle: results[0].course_title,
      courseDescription: results[0].course_description,
      assignments: [],
    };

    // Map over the results to structure the assignments, questions, and options correctly
    results.forEach(row => {
      const assignment = assignmentDetails.assignments.find(a => a.id === row.assignment_id);

      if (!assignment) {
        assignmentDetails.assignments.push({
          id: row.assignment_id,
          title: row.assignment_title,
          description: row.assignment_description,
          due_date: row.assignment_due_date,
          questions: row.question_id ? [{
            id: row.question_id,
            text: row.question_text,
            options: row.options ? JSON.parse(row.options) : [], // Parse the options JSON
            correct_answer: row.correct_answer, // Add correct_answer
          }] : [],
        });
      } else {
        const question = assignment.questions.find(q => q.id === row.question_id);
        if (!question && row.question_id) {
          assignment.questions.push({
            id: row.question_id,
            text: row.question_text,
            options: row.options ? JSON.parse(row.options) : [], // Parse the options JSON
            correct_answer: row.correct_answer, // Add correct_answer
          });
        }
      }
    });

    res.json(assignmentDetails);
  });
});


// View course details
app.get('/api/course-details/:courseId', (req, res) => {
  const courseId = req.params.courseId;

  const query = `
    SELECT courses.id, courses.title, courses.description,
           notes.id AS note_id, notes.title AS note_title, notes.content
    FROM courses
    LEFT JOIN notes ON courses.id = notes.course_id
    WHERE courses.id = ?
  `;

  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching course details:', err);
      res.status(500).json({ error: 'An error occurred while fetching course details.' });
    } else {
      const courseDetails = {
        title: results[0].title,
        description: results[0].description,
        notes: results.map(row => ({
          id: row.note_id,
          title: row.note_title,
          content: row.content
        })).filter(note => note.id) // Filter out rows without notes
      };
      res.json(courseDetails);
    }
  });
});

// Add a new note for a course
app.post('/api/courses/:courseId/notes', (req, res) => {
  const { courseId } = req.params;
  const { title, content } = req.body;

  // Validate the input
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }

  // Insert the note into the database
  const query = 'INSERT INTO notes (course_id, title, content) VALUES (?, ?, ?)';

  db.execute(query, [courseId, title, content], (err, result) => {
    if (err) {
      console.error('Error inserting note into the database:', err);
      return res.status(500).send('Error adding note');
    }
    res.status(200).send({ message: 'Note added successfully', noteId: result.insertId });
  });
});

// Route to handle course enrollment
app.post('/api/enroll', (req, res) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).send('Student ID and Course ID are required');
  }

  // Validate IDs if needed (e.g., ensure they are numbers)
  if (isNaN(studentId) || isNaN(courseId)) {
    return res.status(400).send('Invalid Student ID or Course ID');
  }

  // Check if the student is already enrolled in the course
  const checkQuery = 'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?';
  db.execute(checkQuery, [studentId, courseId], (err, results) => {
    if (err) {
      console.error('Error checking enrollment:', err);
      return res.status(500).send('Error checking enrollment');
    }

    if (results.length > 0) {
      return res.status(400).send('Student is already enrolled in this course');
    }

    // Insert new enrollment record
    const insertQuery = 'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)';
    db.execute(insertQuery, [studentId, courseId], (err, result) => {
      if (err) {
        console.error('Error enrolling in course:', err);
        return res.status(500).send('Error enrolling in course');
      }

      res.status(200).send({ message: 'Successfully enrolled in course' });
    });
  });
});

//submit-answers
app.post('/api/submit-answers', async (req, res) => {
  console.log("📩 Incoming Submission Request:", req.body);

  const { answers, assignmentId, userId } = req.body;
  if (!answers || !Array.isArray(answers) || !assignmentId || !userId) {
    return res.status(400).json({ error: "Invalid or missing data." });
  }

  try {
    // ✅ Start a transaction
    await db.promise().query("START TRANSACTION");

    // ✅ Fetch correct answers
    const [questionResults] = await db.promise().query(
      `SELECT question_id, correct_answer FROM questions WHERE question_id IN (?)`, 
      [answers.map(a => a.question_id)]
    );

    const correctAnswersMap = {};
    questionResults.forEach(q => correctAnswersMap[q.question_id] = q.correct_answer);

    // ✅ Insert student answers
    let correctAnswersCount = 0;
    for (let { question_id, selected_answer } of answers) {
      const isCorrect = correctAnswersMap[question_id] === selected_answer;
      if (isCorrect) correctAnswersCount++;

      await db.promise().query(
        `INSERT INTO student_answers (student_id, question_id, selected_answer, is_correct) 
         VALUES (?, ?, ?, ?)`,
        [userId, question_id, selected_answer, isCorrect]
      );
    }

    // ✅ Insert or update grade
    const totalQuestions = answers.length;
    const gradePercentage = (correctAnswersCount / totalQuestions) * 100;
    const status = "Submitted";

    await db.promise().query(
      `INSERT INTO grades (student_id, assignment_id, total_questions, correct_answers, grade_percentage, status)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE total_questions = VALUES(total_questions), 
                               correct_answers = VALUES(correct_answers),
                               grade_percentage = VALUES(grade_percentage), 
                               status = VALUES(status)`,
      [userId, assignmentId, totalQuestions, correctAnswersCount, gradePercentage, status]
    );

    // ✅ Insert check-in log
    await db.promise().query(
      `INSERT INTO student_checkin_logs (student_id, assignment_id, action, timestamp)
       VALUES (?, ?, ?, NOW())`,
      [userId, assignmentId, "Submitted answers"]
    );

    // ✅ Commit transaction
    await db.promise().query("COMMIT");

    res.status(200).json({
      message: "Answers submitted successfully.",
      correctAnswersCount,
      gradePercentage,
    });

  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error("❌ Error submitting answers:", error);
    res.status(500).json({ error: "Submission failed." });
  }
});

// Route to add a chat message
app.post('/api/chatroom', (req, res) => {
  const { instructor_id, student_id, message } = req.body;

  // Validate input
  if (!instructor_id || !student_id || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert chat message into the database
  const query = 'INSERT INTO chats (instructor_id, student_id, message) VALUES (?, ?, ?)';
  db.query(query, [instructor_id, student_id, message], (error, results) => {
    if (error) {
      console.error('Error inserting chat message:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    // Send back the inserted message details
    res.status(201).json({
      id: results.insertId,
      instructor_id,
      student_id,
      message,
      timestamp: new Date().toISOString(),
    });
  });
});

// Route to retrieve chat messages between a specific student and instructor
app.get('/api/chatroom/:studentId/:instructorId', (req, res) => {
  const { studentId, instructorId } = req.params;

  // Retrieve chat messages between the student and instructor
  const query = `
  SELECT c.id, c.message, c.timestamp, 
         CONCAT(i.first_name, ' ', i.last_name) AS instructor_name, 
         CONCAT(s.first_name, ' ', s.last_name) AS student_name
  FROM chats c
  JOIN instructors i ON c.instructor_id = i.id
  JOIN students s ON c.student_id = s.id
  WHERE (c.student_id = ? AND c.instructor_id = ?) OR (c.student_id = ? AND c.instructor_id = ?)
  ORDER BY c.timestamp DESC
`;
  
  db.query(query, [studentId, instructorId, instructorId, studentId], (error, results) => {
    if (error) {
      console.error('Error retrieving chat messages:', error);
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }

    // Return the retrieved chat messages
    res.status(200).json({ messages: results });
  });
});

// Endpoint to fetch grades for a specific student
// Fetch grades for a specific student
app.get('/api/grades/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`Fetching grades for user ID: ${userId}`);

  const query = `
    SELECT 
      g.grade_id, g.assignment_id, g.total_questions, 
      g.correct_answers, g.grade_percentage, a.title AS assignment_title 
    FROM grades g
    JOIN assignments a ON g.assignment_id = a.id
    WHERE g.student_id = ?;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching grades:', err); // Log the error details
      res.status(500).json({ error: 'An error occurred while fetching grades.' });
    } else {
      console.log('Fetched grades:', results); // Log the fetched results
      res.json(results);
    }
  });
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
