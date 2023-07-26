const express       = require('express')
const app           = express()
const bodyParser    = require("body-parser");
const path          = require('path');
const cors          = require('cors');
const FileUpload    = require('express-fileupload');
const { sequelize } = require('./app/models');
const port          = 8000

// CORS enabled for all
app.use(cors());

// Database synchronization
sequelize.sync({alter: true});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'images' directory
app.use(FileUpload());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Main route
app.get('/', (req, res) => {
  res.send('POS REST API | Alan Creative')
})

// Routes
require("./app/routes/menu.routes")(app);

app.listen(port, () => {
  console.log(`Cetera runs on port ${port}`)
})
