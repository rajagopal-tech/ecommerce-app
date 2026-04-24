const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  const email = 'admin@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await User.findOneAndUpdate(
    { email },
    { name: 'Admin', email, password: hashedPassword, role: 'admin' },
    { upsert: true, new: true }
  );
  
  console.log('Admin user created/updated: admin@example.com / password123');
  process.exit();
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
