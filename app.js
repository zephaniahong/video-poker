const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;

// load statuc files in the public directory
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
