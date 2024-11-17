"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUserWithPassword = authenticateUserWithPassword;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const firebase_1 = require("../firebase");
dotenv_1.default.config();
const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY;
const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`;
function authenticateUserWithPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        try {
            // Firebase authentication request
            const response = yield axios_1.default.post(FIREBASE_AUTH_URL, {
                email,
                password,
                returnSecureToken: true,
            });
            const { idToken } = response.data; // Extract ID token
            // Optionally verify the ID token with Firebase Admin SDK
            const decodedToken = yield firebase_1.admin.auth().verifyIdToken(idToken);
            // Send response back with the token and decoded user info
            return res.status(200).json({ message: 'User authenticated', token: idToken, user: decodedToken });
        }
        catch (error) {
            console.error('Error during login:', error);
            return res.status(400).json({ message: 'Authentication failed', error: error.message });
        }
    });
}
