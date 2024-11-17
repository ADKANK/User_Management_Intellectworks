import { auth, db } from '../firebase';
import express from 'express';

export const registerUser = async (req: express.Request, res: express.Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'User created successfully', user: userRecord });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}


export const editUser = async (req: express.Request, res: express.Response): Promise<void> => {
  // Get the authentication token from the Authorization header
  const token = req.headers['authorization']?.split('Bearer ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication token required' });
    return;
  }

  const { name, email } = req.body;

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userRef = db.collection('users').doc(decodedToken.uid);
    const updatedFields: any = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;

    // Only update fields that are provided in the request body
    if (Object.keys(updatedFields).length > 0) {
      await userRef.update(updatedFields);
    } else {
      res.status(400).json({ message: 'No fields to update' });
      return;
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
}

export const deleteUser = async (req: express.Request, res: express.Response): Promise<void> => {
  const token = req.headers['authorization']?.split('Bearer ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication token required' });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    if (decodedToken.uid !== req.body.userId) {
      res.status(403).json({ message: 'You can only delete your own account' });
      return;
    }

    // Check if the user exists in Firestore before attempting to delete
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await db.collection('users').doc(decodedToken.uid).delete();
    await auth.deleteUser(decodedToken.uid);
    res.status(200).json({ message: 'User deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting user:', error);

    if (error.code === 'auth/argument-error') {
      res.status(400).json({ message: 'Invalid token format' });
      return;
    }
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
}
