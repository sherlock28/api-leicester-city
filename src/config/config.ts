import express from 'express';
import morgan from 'morgan';
/*Este archivo define una funcion que posteriormente es llamada
en index.ts y que permite configurar app recibida y luego retornarla*/

import cors from 'cors';
import { config } from 'dotenv';
import { userRoutes, matchesRoutes } from '../routes';
config(); // Configura la valiables de entorno

const configuration = (app: any) => {
    
    // settings
    app.set('port', process.env.PORT || 4000);

    // middlewares
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());

    // routes
    app.use('/api/users', userRoutes);
    app.use('/api/matches', matchesRoutes);

    return app;
}

export default configuration;