const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  const users = await User.find({}, 'name email role');
  console.log(JSON.stringify(users, null, 2));
  process.exit();
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
