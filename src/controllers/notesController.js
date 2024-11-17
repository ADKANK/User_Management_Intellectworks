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
exports.getNotes = exports.saveNote = void 0;
const firebase_1 = require("../firebase");
const validateRequest_1 = require("../middleware/validateRequest");
const validator_1 = require("../validator");
const db = firebase_1.admin.firestore();
// Save Notes API
exports.saveNote = [
    (0, validateRequest_1.validateRequest)(validator_1.saveNoteSchema),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
        if (!token) {
            res.status(401).json({ message: 'Authentication token required' });
            return;
        }
        const { title, content } = req.body;
        try {
            const decodedToken = yield firebase_1.admin.auth().verifyIdToken(token);
            const note = {
                title,
                content,
                createdAt: new Date(),
                userId: decodedToken.uid,
            };
            // Save the note in Firestore under the user's ID
            yield db.collection('notes').add(note);
            res.status(201).json({ message: 'Note saved successfully', note });
        }
        catch (error) {
            console.error('Error saving note:', error);
            res.status(500).json({ message: 'Error saving note', error: error.message });
        }
    }),
];
// Get Notes API
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authentication token required' });
        return;
    }
    try {
        const decodedToken = yield firebase_1.admin.auth().verifyIdToken(token);
        // Fetch notes for the authenticated user from Firestore
        const snapshot = yield db.collection('notes').where('userId', '==', decodedToken.uid).get();
        if (snapshot.empty) {
            res.status(404).json({ message: 'No notes found' });
            return;
        }
        const notes = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json({ notes });
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
});
exports.getNotes = getNotes;
