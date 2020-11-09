import mongoose from 'mongoose';

/*Se utiliza mongoose para conectarse a la db*/
mongoose.connect(process.env.DATABASE || 'mongodb://localhost/leicestercitytest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
})
.then(db => console.log('db is connected'))
.catch(err => console.error(new Error('failed to connect to database')));
