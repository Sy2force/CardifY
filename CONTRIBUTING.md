# 🤝 Guide de Contribution - Cardify

Merci de votre intérêt pour contribuer à Cardify ! Ce guide vous aidera à démarrer.

## 📋 Table des Matières

- [Code de Conduite](#-code-de-conduite)
- [Comment Contribuer](#-comment-contribuer)
- [Configuration de Développement](#️-configuration-de-développement)
- [Standards de Code](#-standards-de-code)
- [Process de Pull Request](#-process-de-pull-request)
- [Signaler des Bugs](#-signaler-des-bugs)
- [Demander des Fonctionnalités](#-demander-des-fonctionnalités)

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite. Soyez respectueux et constructif dans toutes vos interactions.

## 🚀 Comment Contribuer

### Types de Contributions

- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📚 **Amélioration de la documentation**
- 🎨 **Améliorations UI/UX**
- 🌐 **Traductions**
- ⚡ **Optimisations de performance**

### Workflow de Contribution

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Créer** une branche pour votre fonctionnalité
4. **Développer** et tester vos changements
5. **Commit** avec des messages clairs
6. **Push** vers votre fork
7. **Créer** une Pull Request

## 🛠️ Configuration de Développement

### Prérequis

- Node.js (v18+)
- MongoDB
- Git

### Installation

```bash
# Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/CardifY.git
cd CardifY

# Installer les dépendances
npm run install:all

# Configurer l'environnement
cp .env.example .env

# Initialiser la base de données
npm run seed

# Démarrer en mode développement
npm run dev
```

## 📝 Standards de Code

### TypeScript

- Utilisez TypeScript pour tous les nouveaux fichiers
- Définissez des interfaces pour les types complexes
- Évitez `any`, préférez des types spécifiques

### Style de Code

- **Indentation** : 2 espaces
- **Quotes** : Simple quotes pour les strings
- **Semicolons** : Toujours utiliser
- **Naming** : camelCase pour variables/fonctions, PascalCase pour composants

### Structure des Commits

```bash
type(scope): description courte

Description plus détaillée si nécessaire

- Changement 1
- Changement 2
```

**Types de commits :**

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, style
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

### Exemples

```bash
feat(auth): add password reset functionality
fix(cards): resolve card deletion bug
docs(readme): update installation instructions
style(frontend): improve button hover effects
```

## 🔍 Process de Pull Request

### Avant de Soumettre

- [ ] Tests passent (`npm test`)
- [ ] Build réussit (`npm run build`)
- [ ] Code formaté correctement
- [ ] Documentation mise à jour
- [ ] Pas de vulnérabilités (`npm audit`)

### Template de PR

```markdown
## 📝 Description

Brève description des changements

## 🔄 Type de Changement

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## ✅ Checklist

- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Build réussit
- [ ] Pas de vulnérabilités

## 📸 Screenshots (si applicable)

## 🧪 Comment Tester

Instructions pour tester les changements
```

## 🐛 Signaler des Bugs

### Template de Bug Report

```markdown
**Describe the bug**
Description claire du problème

**To Reproduce**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Expected behavior**
Comportement attendu

**Screenshots**
Si applicable

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Node.js version: [e.g. 18.17.0]
```

## ✨ Demander des Fonctionnalités

### Template de Feature Request

```markdown
**Is your feature request related to a problem?**
Description du problème

**Describe the solution you'd like**
Solution souhaitée

**Describe alternatives you've considered**
Alternatives considérées

**Additional context**
Contexte supplémentaire
```

## 🌐 Traductions

Pour ajouter une nouvelle langue :

1. Créer `frontend/src/locales/[code-langue]/translation.json`
2. Traduire toutes les clés existantes
3. Ajouter la langue dans `frontend/src/i18n/index.ts`
4. Tester l'interface dans la nouvelle langue

## 🧪 Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

### Tests E2E

```bash
npm run test:e2e
```

## 📚 Documentation

- Documenter les nouvelles APIs
- Mettre à jour le README si nécessaire
- Ajouter des commentaires pour le code complexe
- Utiliser JSDoc pour les fonctions importantes

## 🎯 Bonnes Pratiques

### Sécurité

- Ne jamais committer de secrets/tokens
- Valider toutes les entrées utilisateur
- Utiliser HTTPS en production
- Suivre les principes OWASP

### Performance

- Optimiser les requêtes MongoDB
- Utiliser la pagination pour les listes
- Minimiser les re-renders React
- Optimiser les images

### Accessibilité

- Utiliser des attributs ARIA appropriés
- Assurer un contraste suffisant
- Support clavier complet
- Tester avec des lecteurs d'écran

## 🤔 Questions ?

- 💬 **Discussions** : Utilisez les GitHub Discussions
- 📧 **Email** : <shay@cardify.com>
- 🐛 **Issues** : GitHub Issues pour les bugs

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent Cardify meilleur !

---

## Happy Coding! 🚀
