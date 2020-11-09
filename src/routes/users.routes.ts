/*Aqui se definen todos las rutas '/api/users'*/

import { Router, Request, Response } from 'express';
import { userController } from '../controllers';

/*Middleware que verifica la validez del token*/
import { TokenValidation } from '../middlewares/verify.auth';

/*Middleware que verifica la validez datos ingresados 
para registrar un usuario*/
import { ValidateFieldUser } from '../middlewares/users/verify.users';

const router = Router();

router.post('/register', ValidateFieldUser, userController.register);
router.post('/signin', userController.signin);
router.post('/logout', TokenValidation, userController.logout);

export default router;