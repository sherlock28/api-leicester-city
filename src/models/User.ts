/*Aqui se define el Schema mongoose de los usuarios
para operar sobre la db*/

import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    token: string,
    encryptPassword(password: string): Promise<string>,
    validatePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    token: {type: String}
});

/*Este metodo se utiliza para encriptar el password 
antes de ser guardo en la db*/
UserSchema.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/*Este metodo se utiliza para comparar el password ingresado 
por el usuario con el password almacenado en la db*/
UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export default model<IUser>('User', UserSchema);