import Match from '../models/Match';
import cheerio from 'cheerio';
import request from 'request-promise';
import MatchClass from '../entity/Match.class';

/*Este archivo define un funcion similar a la definida en
init.ts con la diferencia de que esta permite ser usada dentro
del cron ya que antes de agregar un partido a la db se
comprueba que no este ya registrado por medio del campo matchId.*/
export async function getMatch() {
    console.log('----------------------------');
    console.log('Loading data, please wait...');
    const $ = await request({
        uri: 'https://www.lcfc.com/matches/results',
        transform: body => cheerio.load(body)
    });
    const matchesStr = $('script[type="application/ld+json"]').html();
    const matchesJSON = await JSON.parse(matchesStr);

    let matches = [];

    /*Se obtiene desde la db el matchId del ultimo partido*/
    const lastMatch = await Match.find().sort({
        "startDate": -1
    }).lean();
    var lastMatchIdFromDB = lastMatch[0].matchId;

    /*Se recorre el array de los partidos obtenidos del scraping*/
    for (let i = 0; i < matchesJSON.length; i++) {

        /*Por cada partido se comprueba que su matchId no coincida 
        con el matchId del ultimo (o mas reciente) en la db.
        
        IMPORTANTE: Esto funcionara correctamente solo si init.ts es ejecutado primero y antes que nada para inicializar la db con todos los partidos disponibles en la web*/
        let lastMatchIdFromPage = parseInt(matchesJSON[i].url.substring(27), 10);

        if(lastMatchIdFromDB |= lastMatchIdFromPage) {
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
    
            const match = new MatchClass(homeTeam, awayTeam, description, startDate, eventStatus, url, competition, homeScore, awayScore, matchId);
    
            const newMatch = new Match({ homeTeam, awayTeam, description, startDate, eventStatus, url, competition, homeScore, awayScore, matchId });
            
            await newMatch.save();
            matches.push(match);
        }
    }
    console.log('Matches added: ');
    console.log(matches);
}

