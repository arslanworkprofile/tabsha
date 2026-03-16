const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function fix() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tabsha';
  await mongoose.connect(uri);
  console.log('✅ Connected');

  const db = mongoose.connection.db;
  
  // Direct MongoDB collection update - bypasses all Mongoose hooks
  const result = await db.collection('users').updateOne(
    { email: 'admin@tabsha.pk' },
    { $set: { role: 'admin', isActive: true } }
  );

  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

  // Verify
  const admin = await db.collection('users').findOne({ email: 'admin@tabsha.pk' });
  
  if (!admin) {
    // Create admin from scratch
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 12);
    await db.collection('users').insertOne({
      name: 'Tabsha Admin',
      email: 'admin@tabsha.pk',
      password: hash,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admin CREATED from scratch');
  } else {
    console.log(`✅ Role is now: ${admin.role}`);
    if (admin.role !== 'admin') {
      console.log('❌ Still not admin - forcing update...');
      await db.collection('users').updateOne(
        { email: 'admin@tabsha.pk' },
        { $set: { role: 'admin' } }
      );
    }
  }

  // Final check
  const check = await db.collection('users').findOne({ email: 'admin@tabsha.pk' });
  console.log('=== FINAL STATE ===');
  console.log('Email:', check.email);
  console.log('Role:', check.role);
  console.log('Active:', check.isActive);
  console.log('===================');
  
  process.exit(0);
}

fix().catch(e => { console.error('❌', e.message); process.exit(1); });
