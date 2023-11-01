import { Router } from 'express';
import * as authControllers from '../controllers/auth-controllers.mjs';
import * as authValidations from '../validations/auth-validations.mjs';

const router = Router();

router.post('/signup', authValidations.signup, authControllers.signup);
router.post('/login', authValidations.login, authControllers.login);
router.post('/logout', authControllers.logout);
router.post('/refresh', authValidations.refresh, authControllers.refresh);
router.post(
  '/change-password',
  authValidations.authenticateUser,
  authValidations.changePassword,
  authControllers.authenticateUser,
  authControllers.changePassword
);

router.post('/forgot-password', authValidations.forgotPassword, authControllers.forgotPassword);

router.post('/reset-password', authValidations.resetPassword, authControllers.resetPassword);

export default router;
