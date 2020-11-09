/*Este archivo define los controladores para cada
uno de los endpoints '/api/matches' */

import { Request, Response } from 'express';
import Match, { IMatch } from '../models/Match';

class MatchesController {     

    /* Controlador para el endpoint '/api/matches/last'.
       Obtiene el partido mas reciente jugado por el equipo 
       que este registrado en la db*/
    public async getLastMatch(req: Request, res: Response) {
        
        /* Se obtien desde la db los partidos ordenados por 
        startDate de forma decreciente. Al estar ordenados 
        decrecientemente, el mas reciente en el index 0*/
        const matches = await Match.find().sort({startDate: -1});
        
        if(matches === null) {
            res.status(404).json({
                message: 'no matches yet.',
                match: null
            });
        } else {
            res.status(200).json({
                message: 'last match',
                match: matches[0] 
            });
        }
    }

    /* Controlador para el endpoint '/api/matches/:matchId'.
       Obtiene el partido que corresponde con el id 
       enviado en el endpoint*/
    public async getMatch(req: Request, res: Response) {

        try {
            /* Se obtiene el matchId*/
            const matchId: number = parseInt(req.params.id);
            console.log(matchId);
            if(typeof(matchId) == "number") {

                /* Se consulta la db con el matchId*/
                const match = await Match.findOne({matchId: matchId}).lean();

                if(match === null) {
                    res.status(404).json({
                        error: 'the match does not exist.'
                    });
                } else {
                    res.status(200).json({
                        message: `id ${match.matchId}`,
                        match: match
                    });
                }
            }
        } catch (err) {
            res.status(400).json({
                message: 'invalid id.'
            });
        }
    }

    /* Controlador para el endpoint '/api/matches/start/:startdate/end/:enddate'.
       Se obtinen los partidos correspondientes entre las fechas 
       enviadas en el endpoint*/
    public async getMatchesBetweenDates(req: Request, res: Response) {
        try {    
            const startdate = new Date(req.params.startdate);
            const enddate = new Date(req.params.enddate);

            /* Se consulta en la db los partidos*/ 
            const matches = await Match.find({$and: [{startDate: {$gte: startdate}},{startDate: {$lt: enddate}}]});

            res.json({
                message: `matches between ${startdate.toISOString()} and ${enddate.toISOString()}`,
                matches: matches
            });
            return;

        } catch (err) {
            res.status(500).json({
                error: 'internal server error.'
            });
            return;
        }
    }

    /* Controlador para el endpoint 
       '/api/matches/points/start/:startdate/end/:enddate'.
       Se obtinen la cantidad de puntos obtenidos por los resultados 
       en la Premier League entre las fechas enviadas en el endpoints*/
    public async getPointsBetweenDates(req: Request, res: Response) {
        try {
            const startdate = new Date(req.params.startdate);
            const enddate = new Date(req.params.enddate);

            /* Se consulta la db teniendo en cuenta en rango 
            de fechas y que la competicion sea especificamente la 
            Premier League*/
            const matches = await Match.find({$and: [{startDate: {$gte: startdate}}, {startDate: {$lt: enddate}}, {competition: {$eq: 'Premier League'}}]});

            /* Se calculan los puntos obtenidos */
            let points: number = 0;
            for(let i = 0; i < matches.length; i++) {
                if(matches[i].homeScore > matches[i].awayScore) {
                    points = points + 3;
                }
                if(matches[i].homeScore == matches[i].awayScore) {
                    points = points + 1;
                }
                if(matches[i].homeScore < matches[i].awayScore) {
                    points = points;
                }
            }

            res.json({
                message: `points obtained between ${startdate.toISOString()} and ${enddate.toISOString()}`,
                points: points
            });
            return;

        } catch (err) {
            res.status(500).json({
                error: 'internal server error.'
            });
            return;
        }
    } 

    /* Controlador para el endpoint '/api/matches/mostgoals'.
       Se obtinen el obtiene el nombre del equipo que mas goles 
       le hizo recientemente al Leicester*/
    public async getTeamMostGoals(req: Request, res: Response) {

        /* Se obtiene los partidos ordenados decrecientemente
        por startDate*/
        const matches = await Match.find().sort({startDate: -1});

        if(matches === null) {
            res.status(404).json({
                message: 'no matches yet.',
                match: null
            });
            return;

        } else {

            let nameTeam = '';
            let goals = 0;
            let index = 0;

            /*Se recorre el array para determinar el nombre del
              equipo que mas goles le marco al Leicester*/
            for(let i = 0; i < matches.length; i++) {
                if(matches[i].homeTeam === "Leicester City") {
                    if(goals < matches[i].awayScore) {
                        nameTeam = matches[i].awayTeam;
                        goals = matches[i].awayScore;
                        index = i;
                    }
                } else {
                    if(goals < matches[i].homeScore) {
                        nameTeam = matches[i].homeTeam;
                        goals = matches[i].homeScore;
                        index = i;
                    }
                }
            }

            /* Se retorna el nombre del equipo, lo goles que le marco y
            la url del resumen del partido*/
            res.status(200).json({
                message: 'last team that scored the most goals.',
                match: nameTeam,
                goals: goals,
                info: matches[index].url
            });
        }
    }

    /* Controlador para el endpoint '/api/matches/new'.
       Permite agregar manualmente un partido.*/
    public async addMatch(req: Request, res: Response) {

        const { homeTeam, awayTeam, description, startDate, 
                eventStatus, url, competition, homeScore, 
                awayScore, matchId } = req.body;
        
        const newMatch: IMatch = new Match({
            homeTeam, awayTeam, description, startDate, 
            eventStatus, url, competition, homeScore, 
            awayScore, matchId
        });

        /* Se consulta la db para verificar que el matchId no 
           este ya registrado.
           IMPORTANTE: La url del match no funcionara si no se 
           utiliza un id generado por la web del Leicester City*/
        const existMatch = await Match.findOne({matchId: matchId});

        if(existMatch === null) {
            const savedMatch = await newMatch.save();
            res.status(200).json({
                message: 'match added',
                match: savedMatch
            });
        } else {
            res.status(400).json({error: 'the matchId is already in use.'});
        }
    }
}

export const matchesController = new MatchesController();


