/*Este archivo define y exporta una funcion que permite verificar 
la validez del token*/

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface IPayload {
    id: string,
    username: string,
    email: string,
    iat: number,
    exp: number
}

/*Permite validar el token*/
export const TokenValidation = async (req: Request, res: Response, next: NextFunction) => {

    /*Se obtiene el token enviado */
    const token = req.header('auth-token');
    /*Se comprueba que se haya recido el token*/
    if(!token) return res.status(401).json({
        message: 'access denied.'
    });

    try {
        /*Utilizando jwt se verifica el token y se obtiene su contenido */
        const payload = jwt.verify(token, process.env.SECRET_KEY || 'othersecretkey') as IPayload;

        /*Con los datos obtenidos del token se verifica que el mismo
        pertenece al usuario consultando en la db*/
        const user =  await User.findOne({$and: [{_id: payload.id}, {token: token}]});
        /*Si la consulta anterio devuelve null significa que el token no pertece al usuario o bien que el usuario no esta logueado y por lo tanto no tiene su token registrado en la db*/
        if(user == null) {
            return res.status(401).json({
                error: 'access denied.'
            });
        } else {
            req.id = payload.id,
            req.username = payload.username;
            req.email = payload.email;
        }

        next();
    } catch (err) {
        return res.status(401).json({
            error: 'invalid token.'
        });
    }
}