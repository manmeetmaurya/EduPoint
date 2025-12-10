const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Profile = require('./models/Profile');
const Category = require('./models/Category');

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ DB Connected');

    // 1. Create admin profile
    const adminProfile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    console.log('✓ Admin profile created');

    // 2. Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@EduPoint.com',
      password: hashedPassword,
      accountType: 'Admin',
      approved: true,
      additionalDetails: adminProfile._id,
      image: '',
    });
    console.log('✓ Admin user created:', adminUser.email);

    // 3. Generate JWT token
    const token = jwt.sign(
      {
        id: adminUser._id,
        email: adminUser.email,
        accountType: adminUser.accountType,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('\n✓ JWT Token generated');

    // 4. Create category using the token
    const category = await Category.create({
      name: 'Web Development',
      description: 'Learn front-end and back-end web development',
    });
    console.log('✓ Category created:', category.name);

    // 5. Display results
    console.log('\n========== SUCCESS ==========');
    console.log('Admin Email:', adminUser.email);
    console.log('Admin Password: Admin@123');
    console.log('\nJWT Token:');
    console.log(token);
    console.log('\nCategory Created:');
    console.log('Name:', category.name);
    console.log('Description:', category.description);
    console.log('ID:', category._id);
    console.log('==============================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
})();
