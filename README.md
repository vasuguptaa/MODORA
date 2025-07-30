# MODORA - See Your Story Through New Eyes

A React-based social platform that helps users share their experiences and receive AI-generated interpretations through multiple perspectives (therapeutic, philosophical, cultural, spiritual, and sociological).

## Features

- 🔐 **Firebase Authentication** - Secure user registration and login
- 📝 **Anonymous Posting** - Share experiences with pseudonymous identities
- 🧠 **AI Interpretations** - Multiple perspective analysis of shared experiences
- 🏷️ **Category Filtering** - Organize posts by life areas (work, relationships, etc.)
- 🌙 **Dark/Light Theme** - Toggle between themes
- 💬 **Comments & Reactions** - Engage with community posts
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Firebase Integration

This application uses Firebase for:
- **Authentication** - User registration and login
- **Firestore Database** - Store user profiles and posts
- **Real-time Updates** - Live data synchronization

### Firebase Configuration

The app requires Firebase configuration. You'll need to:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up environment variables (see Environment Variables section below)

## Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**⚠️ Important**: Never commit your actual Firebase credentials to version control!

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project (already configured)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MODORA
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── feed/          # Post feed and filtering
│   ├── layout/        # Navigation and layout components
│   └── posts/         # Post-related components
├── config/
│   └── firebase.ts    # Firebase configuration
├── contexts/
│   ├── AuthContext.tsx    # Authentication context
│   └── ThemeContext.tsx   # Theme management
├── hooks/
│   ├── useAuth.ts     # Authentication hook
│   └── useTheme.ts    # Theme hook
├── services/
│   └── postService.ts # Firebase post operations
├── types/
│   └── index.ts       # TypeScript type definitions
└── data/
    └── mockData.ts    # Mock data for development
```

## Firebase Collections

### Users Collection
```typescript
{
  id: string;
  uid: string;
  email: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  reputationScore: number;
  createdAt: Date;
}
```

### Posts Collection
```typescript
{
  id: string;
  userId: string;
  username: string;
  title?: string;
  content: string;
  tags: string[];
  lenses: InterpretationLens[];
  interpretations: Interpretation[];
  comments: Comment[];
  createdAt: Timestamp;
  upvotes: number;
  downvotes: number;
  isAnonymous: boolean;
}
```

## Authentication Flow

1. **Registration**: Users create accounts with email, password, and username
2. **Login**: Users authenticate with email and password
3. **Profile Creation**: User profiles are automatically created in Firestore
4. **Session Management**: Firebase handles session persistence

## Features in Detail

### Post Creation
- Multi-step form with content, lenses, and tags
- Anonymous posting with pseudonymous usernames
- Category-based organization

### Interpretations
- AI-generated perspectives through different lenses
- Therapeutic, philosophical, cultural, spiritual, and sociological views
- Contextual analysis of shared experiences

### Community Features
- Upvote/downvote posts
- Comment system with nested replies
- Tone badge detection
- Reaction system (supportive, insightful, thoughtful)

## Development

### Code Quality
- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Security

- Firebase Authentication handles user security
- Firestore security rules protect data
- Anonymous posting protects user privacy
- Input validation on all forms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 