import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { admin } from '../firebase';
dotenv.config();

const FIREBASE_WEB_API_KEY = process.env.WEB_API_KEY
const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`;

async function authenticateUserWithPassword(req: express.Request, res: express.Response) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      // Firebase authentication request
      const response = await axios.post(FIREBASE_AUTH_URL, {
        email,
        password,
        returnSecureToken: true,
      });
  
      const { idToken } = response.data; // Extract ID token
  
      // Optionally verify the ID token with Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(idToken);
  
      // Send response back with the token and decoded user info
      return res.status(200).json({ message: 'User authenticated', token: idToken, user: decodedToken });
    } catch (error: any) {
      console.error('Error during login:', error);
      return res.status(400).json({ message: 'Authentication failed', error: error.message });
    }
  }
  
  export { authenticateUserWithPassword };