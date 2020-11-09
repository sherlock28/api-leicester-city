/*Este archivo define un middleware que permite verificar 
que las fechas ingresadas cumplen con el formato definido 
por la expresion regular 'dataReg'*/

import { Request, Response, NextFunction } from 'express';

export const ValidationDates = (req: Request, res: Response, next: NextFunction) => {

    const dataReg = /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/;
        
    if(req.params.startdate.toString().match(dataReg) === null) {
        res.status(400).json({
            error: 'must be in the format yyyy-mm-dd'
        });
        return;
    }

    if(req.params.enddate.toString().match(dataReg) === null) {
        res.status(400).json({
            error: 'must be in the format yyyy-mm-dd'
        });
        return;
    }

    const startdate = new Date(req.params.startdate);
    const enddate = new Date(req.params.enddate);

    if(startdate.toDateString() === "Invalid Date") {
        res.status(400).json({
            error: 'invalid start date'
        });
        return;
    }

    if(enddate.toDateString() === "Invalid Date") {
        res.status(400).json({
            error: 'invalid end date'
        });
        return;
    }

    next();
}