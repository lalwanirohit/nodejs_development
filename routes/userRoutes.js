import { Router } from 'express';
const router = Router();
import UserController from '../controllers/userController.js';
import { isUserAuthenticated } from '../middlewares/authenticationMiddleware.js';

// public routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);

// protected routes
router.post('/changePassword', isUserAuthenticated, UserController.changePassword);

export default router;