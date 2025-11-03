import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';
import Card from '../models/card.model';
import { logger } from '../services/logger';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cardify');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Card.deleteMany({});
    
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [
      {
        firstName: 'Shay',
        lastName: 'Acoca',
        email: 'shay@cardify.com',
        password: 'password123',
        phone: '+972501234567',
        isAdmin: true,
        isBusiness: true
      },
      {
        firstName: 'Sarah',
        lastName: 'Cohen',
        email: 'sarah@example.com',
        password: 'password123',
        phone: '+33123456789',
        isBusiness: true
      },
      {
        firstName: 'David',
        lastName: 'Martin',
        email: 'david@example.com',
        password: 'password123',
        phone: '+1555123456',
        isBusiness: false
      }
    ];

    // Create users one by one to trigger pre-save hooks for password hashing
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('👥 Created users:', createdUsers.length);

    // Create cards
    const cards = [
      {
        title: 'Shay Acoca',
        subtitle: 'Développeur Full-Stack',
        description: 'Je crée des interfaces fluides qui connectent les gens aux idées. Expert React, Node.js et MongoDB.',
        phone: '+972501234567',
        email: 'shay@cardify.com',
        web: 'https://shayacoca.dev',
        image: {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
          alt: 'Shay Acoca - Full-Stack Developer'
        },
        address: {
          country: 'Israel',
          city: 'Tel Aviv',
          street: 'Rothschild Boulevard',
          houseNumber: '15',
          zip: '6578001'
        },
        user_id: createdUsers[0]._id
      },
      {
        title: 'Sarah Cohen',
        subtitle: 'Designeuse UX/UI',
        description: 'Passionnée par la création d\'expériences utilisateur exceptionnelles. Spécialisée en design système et prototypage.',
        phone: '+33123456789',
        email: 'sarah@example.com',
        web: 'https://sarahcohen.design',
        image: {
          url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
          alt: 'Sarah Cohen - UX/UI Designer'
        },
        address: {
          country: 'France',
          city: 'Paris',
          street: 'Avenue des Champs-Élysées',
          houseNumber: '42',
          zip: '75008'
        },
        user_id: createdUsers[1]._id
      },
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
        user_id: createdUsers[1]._id // Sarah creates this card as business user
      }
    ];

    // Create cards one by one to trigger pre-save hooks
    const createdCards = [];
    for (const cardData of cards) {
      const card = new Card(cardData);
      await card.save();
      createdCards.push(card);
    }
    console.log('💼 Created cards:', createdCards.length);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('👨‍💻 Admin/Business: shay@cardify.com / password123');
    console.log('👩‍🎨 Business: sarah@example.com / password123');
    console.log('👤 User: david@example.com / password123');

    logger.info('Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    logger.error('Database seed error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

const main = async () => {
  await connectDB();
  await seedData();
};

main();
