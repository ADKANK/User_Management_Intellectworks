import { Request, Response } from 'express';
import {  admin } from '../firebase';
import { validateRequest } from '../middleware/validateRequest';
import { saveNoteSchema } from '../validator';
const db = admin.firestore();

// Save Notes API
export const saveNote = [
    validateRequest(saveNoteSchema),
    async (req: Request, res: Response): Promise<void> => {
      const token = req.headers.authorization?.split('Bearer ')[1];
  
      if (!token) {
        res.status(401).json({ message: 'Authentication token required' });
        return;
      }
  
      const { title, content } = req.body;
  
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
  
        const note = {
          title,
          content,
          createdAt: new Date(),
          userId: decodedToken.uid,
        };
  
        // Save the note in Firestore under the user's ID
        await db.collection('notes').add(note);
  
        res.status(201).json({ message: 'Note saved successfully', note });
      } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Error saving note', error: (error as any).message });
      }
    },
  ];
// Get Notes API
export const getNotes = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication token required' });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Fetch notes for the authenticated user from Firestore
    const snapshot = await db.collection('notes').where('userId', '==', decodedToken.uid).get();
    
    if (snapshot.empty) {
      res.status(404).json({ message: 'No notes found' });
      return;
    }

    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes', error: (error as any).message });
  }
};
