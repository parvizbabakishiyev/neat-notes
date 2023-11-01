import { Router } from 'express';
import * as authControllers from '../controllers/auth-controllers.mjs';
import * as userControllers from '../controllers/user-controllers.mjs';
import * as authValidations from '../validations/auth-validations.mjs';
import * as userValidations from '../validations/user-validations.mjs';

const router = Router();

router
  .get('/', authValidations.authenticateUser, authControllers.authenticateUser, userControllers.getOwnUser)
  .patch(
    '/',
    authValidations.authenticateUser,
    userValidations.updateOwnUser,
    authControllers.authenticateUser,
    userControllers.updateOwnUser
  )
  .delete('/', authValidations.authenticateUser, authControllers.authenticateUser, userControllers.deleteOwnUser);

export default router;
