const sqlite3 = require('sqlite3').verbose();

const db =new sqlite3.Database('./sales.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS records(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date Text,
        sales INTEGER,
        count INTEGER,
        hours INTEGER
    )
`);
});

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/records', (req, res) => {
    const {date, sales, count, hours } = 
    req.body;

    db.run(
        'INSERT INTO records (date, sales, count, hours) VALUES (?, ?, ?, ?)',
    [date, sales, count, hours],
    function (err) {

     if (err) {
        return res.status(500).json({ error:
err.message });
        }

        res.json({
          id: this.lastID,
          date: date,
          sales: sales,
          count: count,
          hours: hours
        });
      }
   );
});

app.get('/records', (req,res) => {


db.all('SELECT * FROM records' , [], (err,rows) => {

    if (err) {
        return res.status(500).json({ error:err.message });
    }
    res.json(rows);

      });      

    });


app.delete('/records/:id', (req, res) => {

     
db.run(
    'DELETE FROM records Where id = ?',
    [req.params.id],
    function(err) {

      if (err) {
        return res.status(500).json({ error:err.message });
    }

    res.json({ message: 'deleted' });

});

});

app.patch('/record/:id', (req,res) => {
    const { dete, sales, count, hours } =
req.body;

   db.run(
    `UPDETE records SET
      dete = ?,
      sales = ?
      count = ?
      hours = ?
     WHERE id = ?`,
     [dete, sales, count, hours,
    req.params.id],
        function(err) {
            if (err) {
            return res.status(500).json({ error:
    err.massage });
        }

        res.json({ message: 'updated' });
    }
   );
});

app.listen(3000, () => {

    console.log('server running');
});