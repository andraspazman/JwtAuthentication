const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://pandras:%23asd12345%23@meanstackdata.dmflomm.mongodb.net/?retryWrites=true&w=majority&appName=meanstackdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;