import express, { Request, Response } from 'express';
import config from './config/config';
import cron from 'node-cron';
import { getMatch } from './services/getmatch'

/*Se crea una instancia de app express y es pasada
a la funcion config() que se encarga de configurar la app*/
const app: any = config(express());
import './database';

/*Se define un cron que se ejecuta una vez al dia 
a las 23:59*/
cron.schedule('*/30 * * * *', () => {
    getMatch();
});

app.get('/', (_: Request, res: Response) => {
    return res.json({
        "name": "API LEICESTER CITY",
        "description": "REST API built with Expressjs, Typescript and MongoDB that performs web scraping https://www.lcfc.com and offers endpoints for querying the data obtained.",
    });
});

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});