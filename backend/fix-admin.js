const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

async function fix() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tabsha';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected');

  // Force set admin role
  let user = await User.findOneAndUpdate(
    { email: 'admin@tabsha.pk' },
    { $set: { role: 'admin', isActive: true } },
    { new: true }
  );

  if (!user) {
    user = await User.create({
      name: 'Tabsha Admin',
      email: 'admin@tabsha.pk',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Admin user CREATED');
  } else {
    console.log('✅ Admin role FIXED');
  }

  console.log(`Email: ${user.email}`);
  console.log(`Role:  ${user.role}`);
  console.log(`Active: ${user.isActive}`);

  const all = await User.find().select('email role');
  console.log('\nAll users:');
  all.forEach(u => console.log(` - ${u.email} [${u.role}]`));

  process.exit(0);
}

fix().catch(e => { console.error('❌', e.message); process.exit(1); });
