const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Test direct bcrypt
async function testDirectBcrypt() {
  try {
    console.log('=== Test direct bcrypt ===');
    const plainPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);
    console.log('Generated hash:', hash);
    
    const isMatch = await bcrypt.compare(plainPassword, hash);
    console.log('Direct comparison result:', isMatch);
    
    return hash;
  } catch (error) {
    console.error('Direct bcrypt error:', error);
  }
}

// Test with User model
async function testUserModel() {
  try {
    console.log('\n=== Test User model ===');
    await mongoose.connect('mongodb://localhost:27017/cardify');
    
    const user = await mongoose.connection.db.collection('users').findOne({email: 'shay@cardify.com'});
    console.log('User found:', !!user);
    console.log('Stored hash:', user?.password);
    
    if (user) {
      const directCompare = await bcrypt.compare('password123', user.password);
      console.log('Direct compare with stored hash:', directCompare);
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('User model test error:', error);
  }
}

async function runTests() {
  const newHash = await testDirectBcrypt();
  await testUserModel();
  
  // Test avec le nouveau hash
  console.log('\n=== Test nouveau hash ===');
  const testNewHash = await bcrypt.compare('password123', newHash);
  console.log('Nouveau hash test:', testNewHash);
}

runTests();
