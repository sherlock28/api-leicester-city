/*Este archivo define un middleware que permite verificar que los 
datos ingresado para registrar un nuevo partido sean validos*/

import { Request, Response, NextFunction } from 'express';

export const ValidateFieldMatch = (req: Request, res: Response, next: NextFunction) => {

    const { homeTeam, awayTeam, description, startDate,
        eventStatus, url, competition, homeScore,
        awayScore, matchId } = req.body;

    if (typeof (homeTeam) != 'string' || homeTeam.length <= 0) {
        res.status(400).json({
            error: `homeTeam must be a string with a length greater than 0.`
        });
        return;
    }

    if (typeof (awayTeam) != 'string' || awayTeam.length <= 0) {
        res.status(400).json({
            error: 'awayTeam must be a string with a length greater than 0.'
        });
        return;
    }

    if (typeof (description) != 'string' || description.length <= 0) {
        res.status(400).json({
            error: 'description must be a string with a length greater than 0.'
        });
        return;
    }

    if (typeof (eventStatus) != 'string' || eventStatus.length <= 0) {
        res.status(400).json({
            error: 'eventStatus must be a string with a length greater than 0.'
        });
        return;
    }

    if (typeof (url) != 'string' || url.length <= 0) {
        res.status(400).json({
            error: 'url must be a string with a length greater than 0.'
        });
        return;
    }

    if (typeof (competition) != 'string' || competition.length <= 0) {
        res.status(400).json({
            error: 'competition must be a string with a length greater than 0.'
        });
        return;
    }

    if (typeof (homeScore) != 'number' || homeScore < 0) {
        res.status(400).json({
            error: 'homeScore must be number and greater than 0.'
        });
        return;
    }

    if (typeof (awayScore) != 'number' || awayScore < 0) {
        res.status(400).json({
            error: 'awayScore must be number and greater than 0.'
        });
        return;
    }

    if (typeof (matchId) != 'number' || matchId < 0) {
        res.status(400).json({
            error: 'matchId must be number and greater than 0.'
        });
        return;
    }

    let dataReg = /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/;
        
    if(startDate.toString().match(dataReg) === null) {
        res.status(400).json({
            error: 'startDate must be in the format yyyy-mm-dd'
        });
        return;
    }

    const startdate = new Date(startDate);

    if(startdate.toDateString() === "Invalid Date") {
        res.status(400).json({
            error: 'invalid startDate'
        });
        return;
    }

    next();
}