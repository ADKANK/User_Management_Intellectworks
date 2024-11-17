"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions/v1"));
const express_1 = __importDefault(require("express"));
const notesController_1 = require("./controllers/notesController");
const dotenv_1 = __importDefault(require("dotenv"));
const authController_1 = require("./controllers/authController");
const path_1 = __importDefault(require("path"));
const authLogin_1 = require("./services/authLogin");
const validator_1 = require("./validator");
const validateRequest_1 = require("./middleware/validateRequest");
dotenv_1.default.config();
// Create an Express app
const app = (0, express_1.default)();
// Middleware to parse JSON requests
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
// Define routes for User Management
app.post('/api/register', (0, validateRequest_1.validateRequest)(validator_1.registerUserSchema), authController_1.registerUser);
app.post('/api/login', authLogin_1.authenticateUserWithPassword);
app.put('/api/edit', (0, validateRequest_1.validateRequest)(validator_1.editUserSchema), authController_1.editUser);
app.delete('/api/delete/:userId', (0, validateRequest_1.validateRequest)(validator_1.deleteUserSchema), authController_1.deleteUser);
// Define routes for Notes Management
app.post('/api/notes', (0, validateRequest_1.validateRequest)(validator_1.saveNoteSchema), notesController_1.saveNote);
app.get('/api/notes', notesController_1.getNotes);
// Export the Express app to Firebase Functions
exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map