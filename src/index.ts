import * as functions from 'firebase-functions/v1';
import express, { Request, Response } from 'express';
import { saveNote, getNotes } from './controllers/notesController';
import dotenv from 'dotenv';
import { deleteUser, editUser, registerUser } from './controllers/authController';
import path from 'path';
import { authenticateUserWithPassword } from './services/authLogin';
import { registerUserSchema, editUserSchema, deleteUserSchema, saveNoteSchema } from './validator';
import { validateRequest } from './middleware/validateRequest';
import rateLimit from 'express-rate-limit';

dotenv.config();
// Create an Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100, 
    message: 'Too many requests from this IP, please try again tomorrow.', 
});


app.use(limiter);

app.get('/', (req : Request, res : Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define routes for User Management
app.post('/api/register', validateRequest(registerUserSchema), registerUser);
app.post('/api/login',  authenticateUserWithPassword);
app.put('/api/edit', validateRequest(editUserSchema), editUser);
app.delete('/api/delete/:userId', validateRequest(deleteUserSchema), deleteUser);

// Define routes for Notes Management
app.post('/api/notes', validateRequest(saveNoteSchema), saveNote);
app.get('/api/notes', getNotes);

// Export the Express app to Firebase Functions
exports.app = functions.https.onRequest(app);