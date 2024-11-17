"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveNoteSchema = exports.deleteUserSchema = exports.editUserSchema = exports.registerUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.',
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'any.required': 'Password is required.',
    }),
    name: joi_1.default.string().min(2).required().messages({
        'string.min': 'Name must be at least 2 characters long.',
        'any.required': 'Name is required.',
    }),
});
exports.editUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().optional(),
    name: joi_1.default.string().min(2).optional(),
}).or('email', 'name').messages({
    'object.missing': 'At least one field (email or name) must be provided for update.',
});
exports.deleteUserSchema = joi_1.default.object({
    userId: joi_1.default.string().required().messages({
        'any.required': 'User ID is required for deletion.',
    }),
});
exports.saveNoteSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).required().messages({
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),
    content: joi_1.default.string().min(1).required().messages({
        'string.empty': 'Content is required',
        'any.required': 'Content is required',
    }),
});
//# sourceMappingURL=validator.js.map