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
cron.schedule('59 23 * * *', () => {
    getMatch();
});

app.get('/', (req: Request, res: Response) => {
    res.send('API LEICESTER CITY')
});

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});