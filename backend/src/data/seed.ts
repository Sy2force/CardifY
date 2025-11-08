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

const seedData = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      logger.error('MONGO_URI environment variable is required for seeding');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
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
    const businessUsers = createdUsers.filter((user: { isBusiness: boolean }) => user.isBusiness);
    
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
      },
      {
        title: 'Marie Dubois',
        subtitle: 'Architecte d\'Intérieur',
        description: 'Création d\'espaces de vie uniques et fonctionnels. Spécialisée dans le design moderne et écologique.',
        phone: '+33145678901',
        email: 'marie@dubois-design.fr',
        web: 'https://dubois-design.fr',
        image: {
          url: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e2c3?w=300&h=300&fit=crop&crop=face',
          alt: 'Marie Dubois - Interior Architect'
        },
        address: {
          country: 'France',
          city: 'Paris',
          street: 'Rue de Rivoli',
          houseNumber: '45',
          zip: '75001'
        },
        user_id: businessUsers[0]._id,
        likes: []
      },
      {
        title: 'Alessandro Rossi',
        subtitle: 'Chef Cuisinier',
        description: 'Cuisine italienne authentique avec une touche moderne. 15 ans d\'expérience dans la gastronomie.',
        phone: '+39066789012',
        email: 'alessandro@rossi-cucina.it',
        web: 'https://rossi-cucina.it',
        image: {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
          alt: 'Alessandro Rossi - Chef'
        },
        address: {
          country: 'Italy',
          city: 'Rome',
          street: 'Via del Corso',
          houseNumber: '78',
          zip: '00186'
        },
        user_id: businessUsers[1]._id,
        likes: []
      },
      {
        title: 'Emma Johnson',
        subtitle: 'Photographe Professionnelle',
        description: 'Spécialisée dans la photographie de mariage et portrait. Capturer vos moments les plus précieux.',
        phone: '+44207123456',
        email: 'emma@johnson-photo.co.uk',
        web: 'https://johnson-photography.co.uk',
        image: {
          url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
          alt: 'Emma Johnson - Photographer'
        },
        address: {
          country: 'United Kingdom',
          city: 'London',
          street: 'Baker Street',
          houseNumber: '221',
          zip: 'NW1 6XE'
        },
        user_id: businessUsers[0]._id,
        likes: []
      },
      {
        title: 'Carlos Rodriguez',
        subtitle: 'Développeur Full-Stack',
        description: 'Création d\'applications web et mobiles innovantes. Expert en React, Node.js et technologies cloud.',
        phone: '+34912345678',
        email: 'carlos@rodriguez-dev.es',
        web: 'https://rodriguez-dev.es',
        image: {
          url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
          alt: 'Carlos Rodriguez - Developer'
        },
        address: {
          country: 'Spain',
          city: 'Madrid',
          street: 'Gran Vía',
          houseNumber: '12',
          zip: '28013'
        },
        user_id: businessUsers[1]._id,
        likes: []
      },
      {
        title: 'Sophie Chen',
        subtitle: 'Coach en Développement Personnel',
        description: 'Accompagnement personnalisé pour atteindre vos objectifs. Spécialisée en leadership et gestion du stress.',
        phone: '+1416789012',
        email: 'sophie@chen-coaching.ca',
        web: 'https://chen-coaching.ca',
        image: {
          url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
          alt: 'Sophie Chen - Life Coach'
        },
        address: {
          country: 'Canada',
          city: 'Toronto',
          street: 'Queen Street West',
          houseNumber: '456',
          zip: 'M5V 2A9'
        },
        user_id: businessUsers[0]._id,
        likes: []
      }
    ];

    // Create cards one by one to trigger pre-save hooks for bizNumber generation
    const createdCards = [];
    for (const cardData of cards) {
      const card = new Card(cardData);
      await card.save();
      createdCards.push(card);
    }
    logger.info(`Created ${createdCards.length} demo cards`);

    // Create project cards
    const projectCards = await createProjectCards();
    logger.info(`Created ${projectCards.length} project cards`);

    logger.info('Database seeded successfully!');
    logger.info('\n🌱 Database seeded with demo data:');
    logger.info('👤 Demo Users:');
    logger.info('  - admin@cardify.com (password: admin123) - Admin');
    logger.info('  - sarah@example.com (password: business123) - Business User');
    logger.info('  - john@example.com (password: user123) - Regular User');
    logger.info(`🃏 ${createdCards.length + projectCards.length} total cards created`);
    logger.info(`📋 ${projectCards.length} project showcase cards added`);

  } catch (error) {
    logger.error('Seeding error:', { error: String(error) });
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedData();
