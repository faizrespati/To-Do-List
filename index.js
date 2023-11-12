const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_list',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Routes
app.get('/', (req, res) => {
  connection.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('Error fetching tasks from database: ', err);
      return;
    }
    res.render('index', { tasks: results });
  });
});

app.post('/add', (req, res) => {
  const taskName = req.body.task_name;
  const dueDate = req.body.due_date;

  connection.query(
    'INSERT INTO tasks (task_name, due_date) VALUES (?, ?)',
    [taskName, dueDate],
    (err) => {
      if (err) {
        console.error('Error adding task to database: ', err);
        return;
      }
      res.redirect('/');
    }
  );
});

app.post('/update/:id', (req, res) => {
    const taskId = req.params.id;
    const newStatus = req.body.status;
  
    connection.query(
      'UPDATE tasks SET status = ? WHERE id = ?',
      [newStatus, taskId],
      (err) => {
        if (err) {
          console.error('Error updating task status in the database: ', err);
          return;
        }
        res.redirect('/');
      }
    );
  });  

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}/`);
});
