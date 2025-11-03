import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import Card from '../models/card.model';
import { logger } from '../services/logger';
import { createProjectCards } from './project-cards';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cardify');
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Card.deleteMany({});
    logger.info('Cleared existing data');

    // Create demo users with properly hashed passwords
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@cardify.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '+1234567890',
        isBusiness: true,
        isAdmin: true
      },
      {
        firstName: 'Sarah',
        lastName: 'Cohen',
        email: 'sarah@example.com',
        password: await bcrypt.hash('business123', 10),
        phone: '+1987654321',
        isBusiness: true
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('user123', 10),
        phone: '+1122334455',
        isBusiness: false
      }
    ];

    const createdUsers = await User.insertMany(users);
    logger.info(`Created ${createdUsers.length} demo users`);

    // Create demo cards for business users
    const businessUsers = createdUsers.filter((user: any) => user.isBusiness);
    
    const cards = [
      {
        title: 'David Martin',
        subtitle: 'Consultant Marketing Digital',
        description: 'J\'aide les entreprises à développer leur présence en ligne et à atteindre leurs objectifs commerciaux.',
        phone: '+1555123456',
        email: 'david@example.com',
        web: 'https://davidmartin.consulting',
        image: {
          url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
          alt: 'David Martin - Digital Marketing Consultant'
        },
        address: {
          country: 'United States',
          city: 'New York',
          street: 'Broadway',
          houseNumber: '123',
          zip: '10001'
        },
        user_id: businessUsers[1]._id,
        likes: []
      }
    ];

    // Create cards one by one to trigger pre-save hooks
    const createdCards = await Card.insertMany(cards);
    logger.info(`Created ${createdCards.length} demo cards`);

    // Create project cards
    const projectCards = await createProjectCards();
    logger.info(`Created ${projectCards.length} project cards`);

    logger.info('Database seeded successfully!');
    console.log('\n🌱 Database seeded with demo data:');
    console.log('👤 Demo Users:');
    console.log('  - admin@cardify.com (password: admin123) - Admin');
    console.log('  - sarah@example.com (password: business123) - Business User');
    console.log('  - john@example.com (password: user123) - Regular User');
    console.log(`🃏 ${createdCards.length + projectCards.length} total cards created`);
    console.log(`📋 ${projectCards.length} project showcase cards added`);

  } catch (error) {
    logger.error('Seeding error:', error);
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedData();
