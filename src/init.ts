import { config } from 'dotenv';
config();
import Match from './models/Match';
import cheerio from 'cheerio';
import request from 'request-promise';
import MatchClass from './entity/Match.class';
import './database';

/* Este archivo define una funcion que realiza el scraping,
obtione los datos y los almacena en db.
Solo se lo debe ejecutar la primera vez para inicializar la db.
Puede ser ejecutado manualmente con 'npm run init' o se ejecutara automaticamente cuando cuando la app es desplegada.
*/

export async function init() {
    console.log('Loading data, please wait...');
    const $ = await request({
        uri: 'https://www.lcfc.com/matches/results',
        transform: body => cheerio.load(body)
    });
    /*Se obtiene un array con todos los partidos scrapeados desde la web*/
    const matchesStr = $('script[type="application/ld+json"]').html();
    const matchesJSON = await JSON.parse(matchesStr);

    let matches: any = [];

    /*Se recorre el array para obtener de cada elemento iterado 
    los datos necesarios*/
    for (let i = 0; i < matchesJSON.length; i++) {

        /*Se hace un scraping a la web que contiene el resumen 
        del partido para obtener la competicion a la pertenece
        y las cantidad de goles anotados por cada equipo*/
        const $$ = await request({
            uri: matchesJSON[i].url,
            transform: body => cheerio.load(body)
        });

        let competition = $$(`.mc-header__competition span.u-screen-reader`).text();

        let homeScore = parseInt($$(`.scorebox__teams-container 
            .scorebox__score-container 
            .js-match-score-container 
            .score 
            .home`).text());

        let awayScore = parseInt($$(`.scorebox__teams-container 
            .scorebox__score-container 
            .js-match-score-container 
            .score 
            .away`).text());

        let homeTeam = matchesJSON[i].homeTeam.name;
        let awayTeam = matchesJSON[i].awayTeam.name;
        let description = matchesJSON[i].description;
        let startDate = new Date(matchesJSON[i].startDate);
        let eventStatus = matchesJSON[i].eventStatus;
        let url = matchesJSON[i].url;
        let matchId = parseInt(matchesJSON[i].url.substring(27));

        /*Se crea una clase con los datos obtenidos. Esto solo es necesario para mostrar por consola los datos obtenidos*/
        const match = new MatchClass(homeTeam, awayTeam, description, startDate, eventStatus, url, competition, homeScore, awayScore, matchId);

        /*Se crea un nuevo modelo mongoose con los datos*/
        const newMatch = new Match({ homeTeam, awayTeam, description, startDate, eventStatus, url, competition, homeScore, awayScore, matchId });
        
        /*Se guarda el partido en la db*/
        await newMatch.save();
        matches.push(match);
        process.stdout.write(` ${i}% loading data: ${match.url}\r`);
    }
    console.log('100% completed\r');
    console.log('##################### Matches #####################');
    console.log(matches);
    process.exit();
}

init();