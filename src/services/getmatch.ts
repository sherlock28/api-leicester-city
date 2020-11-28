import Match from '../models/Match';
import cheerio from 'cheerio';
import request from 'request-promise';
import MatchClass from '../entity/Match.class';

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

    const lastMatch = await Match.find().sort({
        "startDate": -1
    }).lean();

    var lastMatchIdFromDB = lastMatch[0].matchId;
    let lastMatchIdFromPage = parseInt(matchesJSON[0].url.substring(27), 10);

    if (lastMatchIdFromDB != lastMatchIdFromPage) {
        const $$ = await request({
            uri: matchesJSON[0].url,
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

        let homeTeam = matchesJSON[0].homeTeam.name;
        let awayTeam = matchesJSON[0].awayTeam.name;
        let description = matchesJSON[0].description;
        let startDate = new Date(matchesJSON[0].startDate);
        let eventStatus = matchesJSON[0].eventStatus;
        let url = matchesJSON[0].url;
        let matchId = parseInt(matchesJSON[0].url.substring(27));

        const match = new MatchClass(homeTeam, awayTeam, description, startDate, eventStatus, url, competition, homeScore, awayScore, matchId);

        const newMatch = new Match({ homeTeam, awayTeam, description, startDate, eventStatus, url, competition, homeScore, awayScore, matchId });

        await newMatch.save();
        matches.push(match);
    }

    console.log('Matches added: ');
    console.log(matches);
}

