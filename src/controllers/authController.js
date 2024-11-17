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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = exports.registerUser = void 0;
const firebase_1 = require("../firebase");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }
    try {
        const userRecord = yield firebase_1.auth.createUser({
            email,
            password,
            displayName: name,
        });
        yield firebase_1.db.collection('users').doc(userRecord.uid).set({
            email,
            name,
            createdAt: new Date(),
        });
        res.status(201).json({ message: 'User created successfully', user: userRecord });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});
exports.registerUser = registerUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get the authentication token from the Authorization header
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authentication token required' });
        return;
    }
    const { name, email } = req.body;
    try {
        const decodedToken = yield firebase_1.auth.verifyIdToken(token);
        const userRef = firebase_1.db.collection('users').doc(decodedToken.uid);
        const updatedFields = {};
        if (name)
            updatedFields.name = name;
        if (email)
            updatedFields.email = email;
        // Only update fields that are provided in the request body
        if (Object.keys(updatedFields).length > 0) {
            yield userRef.update(updatedFields);
        }
        else {
            res.status(400).json({ message: 'No fields to update' });
            return;
        }
        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authentication token required' });
        return;
    }
    try {
        const decodedToken = yield firebase_1.auth.verifyIdToken(token);
        if (decodedToken.uid !== req.body.userId) {
            res.status(403).json({ message: 'You can only delete your own account' });
            return;
        }
        // Check if the user exists in Firestore before attempting to delete
        const userDoc = yield firebase_1.db.collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        yield firebase_1.db.collection('users').doc(decodedToken.uid).delete();
        yield firebase_1.auth.deleteUser(decodedToken.uid);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        if (error.code === 'auth/argument-error') {
            res.status(400).json({ message: 'Invalid token format' });
            return;
        }
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});
exports.deleteUser = deleteUser;
