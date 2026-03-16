const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

async function fix() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tabsha';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  // Force update admin role using $set to bypass any hooks
  const result = await User.collection.updateOne(
    { email: 'admin@tabsha.pk' },
    { $set: { role: 'admin', isActive: true } }
  );

  if (result.matchedCount === 0) {
    // User doesn't exist - create with bcrypt manually
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 12);
    await User.collection.insertOne({
      name: 'Tabsha Admin',
      email: 'admin@tabsha.pk',
      password: hash,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admin user CREATED');
  } else {
    console.log(`✅ Admin role FIXED (matched: ${result.matchedCount}, modified: ${result.modifiedCount})`);
  }

  // Verify the fix
  const admin = await User.collection.findOne({ email: 'admin@tabsha.pk' });
  console.log('');
  console.log('=== VERIFICATION ===');
  console.log(`Email:  ${admin.email}`);
  console.log(`Role:   ${admin.role}`);
  console.log(`Active: ${admin.isActive}`);
  console.log('');

  if (admin.role === 'admin') {
    console.log('🎉 SUCCESS! Login with:');
    console.log('   admin@tabsha.pk / admin123');
  } else {
    console.log('❌ FAILED - role is still:', admin.role);
  }

  process.exit(0);
}

fix().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
