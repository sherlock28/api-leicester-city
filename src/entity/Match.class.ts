/*Este archivo define la clase Match utilizada en los archivos
init.ts y getmatch.ts*/

interface IMatchClass {
    homeTeam: string,
    awayTeam: string,
    description: string,
    startDate: Date,
    eventStatus: string,
    url: string,
    competition: string,
    homeScore: number,
    awayScore: number,
    matchId: number
}

class MatchClass implements IMatchClass {
    
    homeTeam: string;
    awayTeam: string;
    description: string;
    startDate: Date;
    eventStatus: string;
    url: string;
    competition: string;
    homeScore: number;
    awayScore: number;
    matchId: number;

    constructor(homeTeam: string, awayTeam: string, 
                description: string, startDate: Date, 
                eventStatus: string, url: string, 
                competition: string, homeScore: number,
                awayScore: number, matchId: number) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.description = description;
        this.startDate = startDate;
        this.eventStatus = eventStatus;
        this.url = url;
        this.competition = competition;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.matchId = matchId;
    }
}

export default MatchClass; 