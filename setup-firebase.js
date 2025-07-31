#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup for MODORA 🔥\n');

console.log('This script will help you create a .env file with your Firebase configuration.\n');

console.log('To get your Firebase configuration:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Select your project (or create a new one)');
console.log('3. Click the gear icon (⚙️) next to "Project Overview"');
console.log('4. Select "Project settings"');
console.log('5. Scroll down to "Your apps" section');
console.log('6. Click the web icon (</>) to add a web app');
console.log('7. Copy the configuration values\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  'Enter your Firebase API Key: ',
  'Enter your Firebase Auth Domain: ',
  'Enter your Firebase Project ID: ',
  'Enter your Firebase Storage Bucket: ',
  'Enter your Firebase Messaging Sender ID: ',
  'Enter your Firebase App ID: ',
  'Enter your Firebase Measurement ID (optional, press Enter to skip): '
];

const answers = [];

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFile();
    return;
  }

  readline.question(questions[index], (answer) => {
    answers.push(answer.trim());
    askQuestion(index + 1);
  });
}

function createEnvFile() {
  const envContent = `# Firebase Configuration
VITE_FIREBASE_API_KEY=${answers[0]}
VITE_FIREBASE_AUTH_DOMAIN=${answers[1]}
VITE_FIREBASE_PROJECT_ID=${answers[2]}
VITE_FIREBASE_STORAGE_BUCKET=${answers[3]}
VITE_FIREBASE_MESSAGING_SENDER_ID=${answers[4]}
VITE_FIREBASE_APP_ID=${answers[5]}
${answers[6] ? `VITE_FIREBASE_MEASUREMENT_ID=${answers[6]}` : ''}
`;

  const envPath = path.join(process.cwd(), '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\nNext steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Test the authentication by creating an account');
    console.log('3. Check the Firebase Console to see if users are created');
    console.log('\nFor more information, see FIREBASE_SETUP.md');
  } catch (error) {
    console.error('\n❌ Error creating .env file:', error.message);
  }
  
  readline.close();
}

console.log('Please provide your Firebase configuration values:\n');
askQuestion(0); 