/*Este archivo define un middleware que permite verificar que los 
datos ingresado para registrar un nuevo usuario son validos, por 
ejemplo que su password no sea menor a 8 caracteres, que el email cumpla
con la expresion regular 'emailRegex', etc*/

import { Request, Response, NextFunction } from 'express';

export const ValidateFieldUser = (req: Request, res: Response, next: NextFunction) => {

    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    const { username, email, password, confirmpass} = req.body;

    if (username.length == 0) {
        res.status(400).json({ error: 'username is required.' });
        return;
    }

    if (username.length < 5) {
        res.status(400).json({ error: 'username must be at least 8 chars long.' });
        return;
    }

    if (email.length == 0) {
        res.status(400).json({ error: 'email is required.' });
        return;
    }

    if(req.body.email.toString().match(emailRegex) === null) {
        res.status(400).json({
            error: 'invalid email.'
        });
        return;
    }

    if (username.length < 5) {
        res.status(400).json({ error: 'username must be at least 8 chars long.' });
        return;
    }

    if (password != confirmpass) {
        res.status(400).json({ message: 'password not match.' });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({ message: 'password must be at least 8 chars long.' });
        return;
    }

    next();
}