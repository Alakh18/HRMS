import express from 'express';
import { signUp, signIn, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateSignUp, validateSignIn } from '../middlewares/validation.js';

const router = express.Router();

router.post('/signup', validateSignUp, signUp);
router.post('/signin', validateSignIn, signIn);
router.get('/profile', authenticate, getProfile);

export default router;

