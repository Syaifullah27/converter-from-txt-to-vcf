const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/EsyehaXDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Terhubung ke MongoDB lokal');
});