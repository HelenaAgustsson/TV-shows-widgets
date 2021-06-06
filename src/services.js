import { pool } from './mysql-pool';

class ShowService {
  getShows(success) {
    pool.query('SELECT * FROM Shows', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
  getShow(id, success) {
    pool.query('SELECT * FROM Shows WHERE id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }
  getRatings(showId, success) {
    pool.query('SELECT * FROM ShowRatings WHERE ShowId=?', [showId], (error, results) => {
      if (error) return console.log(error);
      success(results);
    });
  }
  addRating(showId, showRating, success) {
    pool.query(
      'INSERT INTO ShowRatings (rating, showId) VALUES (?,?)',
      [showRating, showId],
      (error, results) => {
        if (error) return console.log(error);
        success();
      }
    );
  }
  saveNewShow(show, success) {
    pool.query(
      'INSERT INTO Shows (title, description) VALUES (?,?)',
      [show.title, show.description],
      (error, results) => {
        if (error) return console.log(error);
        success();
      }
    );
  }
}

class StudentService {
  getStudents(success) {
    pool.query('SELECT * FROM Shows', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getStudent(id, success) {
    pool.query('SELECT * FROM Students WHERE id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateStudent(student, success) {
    pool.query(
      'UPDATE Students SET name=?, email=? WHERE id=?',
      [student.name, student.email, student.id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }
}

export let showService = new ShowService();
export let studentService = new StudentService();
