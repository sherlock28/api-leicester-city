/*Este archivo define los controladores para cada
uno de los endpoints '/api/users' */

import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

class UserController {

    /* Controlador para el endpoint '/api/users/register'.
       Permite registrar un nuevo usuario*/
    public async register(req: Request, res: Response) {
        
        const { username, email, password, confirmpass} = req.body;
        
        const newUser: IUser = new User({
            username: username,
            email: email,
            password: password
        });
        

        /* Se consulta la db para asegurarse de que email no
        este ya registrado */
        const user = await User.findOne({email: email});
        if(user === null) {
            /* Se llama la funcion encryptPassword para obtener el 
            password encriptado */
            newUser.password = await newUser.encryptPassword(newUser.password);
            /* Se guarda el usuario en la db */
            const savedUser = await newUser.save();
            res.status(201).json({
                message: 'registered.',
                user: savedUser
            });
            } else {
                res.status(400).json({error: 'the email is already in use.'});
                return;
            }
        
    }

    /* Controlador para el endpoint '/api/users/signin'.
       Permite loguear un usuario y generar su token*/
    public async signin(req: Request, res: Response) {

        /* Se verifica el usuario con el email recibido esta registrado*/
        const user = await User.findOne({email: req.body.email});
        if(user === null) {
            res.status(400).json({
                error: 'auth failed, email not found'
            });
        } else {
            /* Se llama la funcion validatePassword para comprobar que password
            recibido coincide con el password almacenado en la db*/
            const isCorrectPass: boolean = await user.validatePassword(req.body.password);
            if(!isCorrectPass) {
                res.status(400).json({error: 'Invalid password'});
            } else {
                /* Se genera el token por medio de la funcion sign de jwt*/
                const token: string = jwt.sign({
                    id: user._id,
                    username: user.username,
                    email: user.email}, 
                    process.env.SECRET_KEY || 'othersecretkey', 
                    {expiresIn: 600 });// expires in 10 minutes
                const query = { email: user.email };
                /* Se guarda el token generado para el usuario en la db*/
                await User.findOneAndUpdate(query, { token: token});
                /* Se envia el token en la propiedad 'auth-token del header de la respuesta'*/
                res.status(200).header('auth-token', token).json({
                    message: 'is authenticated'
                });
            }
        }      
    }

    /* Controlador para el endpoint '/api/users/logout'.
       Permite desloguear un usuario y eliminar su token*/
    public async logout(req: Request, res: Response) {
        /* Se obtiene su token recibido en el header del request*/
        const token = req.header('auth-token');
        const query = {token: token};
        /* Se busca en la db a que usuario pertenece el token*/
        const user = await User.findOne(query); 
        if(user === null) {
            res.status(400).json({error: 'invalid token'});
        } else {
            /* Se elimina el token actualizando en campo 
               token del usuario en la db*/
            await User.update(query, { $unset: { token: 1}});    
            res.json({message: 'is logged out'});
        }
    }
}

export const userController = new UserController();