"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectCards = void 0;
const card_model_1 = __importDefault(require("../models/card.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const logger_1 = require("../services/logger");
const createProjectCards = async () => {
    try {
        let projectUser = await user_model_1.default.findOne({ email: 'projects@cardify.com' });
        if (!projectUser) {
            projectUser = new user_model_1.default({
                firstName: 'Cardify',
                lastName: 'Projects',
                email: 'projects@cardify.com',
                password: 'hashedpassword123',
                phone: '+33123456789',
                isBusiness: true
            });
            await projectUser.save();
        }
        const projectCards = [
            {
                title: 'E-Commerce Platform',
                subtitle: 'Développement Full-Stack',
                description: 'Plateforme e-commerce moderne avec React, Node.js et MongoDB. Interface utilisateur intuitive, gestion des commandes, paiements sécurisés et tableau de bord administrateur complet.',
                phone: '+33142868300',
                email: 'contact@ecommerce-platform.fr',
                web: 'https://ecommerce-platform.demo.fr',
                image: {
                    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
                    alt: 'E-Commerce Platform'
                },
                address: {
                    country: 'France',
                    city: 'Paris',
                    street: 'Avenue des Champs-Élysées',
                    houseNumber: '101',
                    zip: '75008',
                    state: 'Île-de-France'
                },
                user_id: projectUser._id,
                likes: []
            },
            {
                title: 'Application Mobile Fitness',
                subtitle: 'Développement Mobile React Native',
                description: 'Application mobile de fitness avec suivi des entraînements, plans nutritionnels personnalisés, communauté sociale et intégration avec les appareils connectés.',
                phone: '+33145678901',
                email: 'hello@fitnessapp.fr',
                web: 'https://fitnessapp.demo.fr',
                image: {
                    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                    alt: 'Fitness Mobile App'
                },
                address: {
                    country: 'France',
                    city: 'Lyon',
                    street: 'Rue de la République',
                    houseNumber: '25',
                    zip: '69002',
                    state: 'Auvergne-Rhône-Alpes'
                },
                user_id: projectUser._id,
                likes: []
            },
            {
                title: 'Système de Gestion Immobilière',
                subtitle: 'Solution SaaS B2B',
                description: 'Plateforme SaaS complète pour agences immobilières. Gestion des biens, CRM clients, visites virtuelles, génération de documents automatisée et analytics avancés.',
                phone: '+33491543210',
                email: 'info@immo-saas.fr',
                web: 'https://immo-saas.demo.fr',
                image: {
                    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
                    alt: 'Real Estate Management System'
                },
                address: {
                    country: 'France',
                    city: 'Marseille',
                    street: 'La Canebière',
                    houseNumber: '47',
                    zip: '13001',
                    state: 'Provence-Alpes-Côte d\'Azur'
                },
                user_id: projectUser._id,
                likes: []
            },
            {
                title: 'Plateforme d\'Apprentissage en Ligne',
                subtitle: 'EdTech & IA',
                description: 'Plateforme éducative avec IA pour personnaliser l\'apprentissage. Cours interactifs, évaluations automatisées, suivi de progression et certificats numériques.',
                phone: '+33556789012',
                email: 'contact@edutech-ai.fr',
                web: 'https://edutech-ai.demo.fr',
                image: {
                    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
                    alt: 'Online Learning Platform'
                },
                address: {
                    country: 'France',
                    city: 'Bordeaux',
                    street: 'Cours de l\'Intendance',
                    houseNumber: '12',
                    zip: '33000',
                    state: 'Nouvelle-Aquitaine'
                },
                user_id: projectUser._id,
                likes: []
            },
            {
                title: 'Dashboard Analytics IoT',
                subtitle: 'Big Data & Visualisation',
                description: 'Tableau de bord temps réel pour objets connectés industriels. Collecte de données massives, analyses prédictives, alertes intelligentes et rapports personnalisés.',
                phone: '+33383352145',
                email: 'support@iot-analytics.fr',
                web: 'https://iot-analytics.demo.fr',
                image: {
                    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
                    alt: 'IoT Analytics Dashboard'
                },
                address: {
                    country: 'France',
                    city: 'Nancy',
                    street: 'Place Stanislas',
                    houseNumber: '8',
                    zip: '54000',
                    state: 'Grand Est'
                },
                user_id: projectUser._id,
                likes: []
            }
        ];
        await card_model_1.default.deleteMany({ user_id: projectUser._id });
        const createdCards = [];
        for (const cardData of projectCards) {
            const card = new card_model_1.default(cardData);
            await card.save();
            createdCards.push(card);
        }
        logger_1.logger.info(`${createdCards.length} cartes de projets créées avec succès`);
        return createdCards;
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la création des cartes de projets:', { error: String(error) });
        throw error;
    }
};
exports.createProjectCards = createProjectCards;
