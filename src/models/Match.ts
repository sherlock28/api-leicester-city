/*Aqui se define el Schema mongoose de los partidos
para operar sobre la db*/

import { Schema, model, Document } from 'mongoose'; 

export interface IMatch extends Document {
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

const MatchSchema = new Schema({
    homeTeam: {type: String, required: true},
    awayTeam: {type: String, required: true},
    description: {type: String, required: true},
    startDate: {type: Date, required: true},
    eventStatus: {type: String, required: true},
    url: {type: String, required: true},
    competition: {type: String, required: true},
    homeScore: {type: Number, required: true},
    awayScore: {type: Number, required: true},
    matchId: {type: Number, require: true}
});

export default model<IMatch>('Match', MatchSchema);