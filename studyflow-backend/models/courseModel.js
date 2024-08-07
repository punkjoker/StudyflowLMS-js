const db = require('../db');

// Add methods to handle notes and resources
const Course = {
  create: (newCourse, result) => {
    db.query("INSERT INTO courses SET ?", newCourse, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created course: ", { id: res.insertId, ...newCourse });
      result(null, { id: res.insertId, ...newCourse });
    });
  },

  addResource: (courseId, resourceUrl, result) => {
    db.query("INSERT INTO course_resources SET course_id = ?, resource_url = ?", [courseId, resourceUrl], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("added resource: ", { id: res.insertId, courseId, resourceUrl });
      result(null, { id: res.insertId, courseId, resourceUrl });
    });
  },

  // Add other methods as needed
};

module.exports = Course;
