import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import  knex  from 'knex'
import { handleRegister} from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleImage} from './controllers/image.js';




const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'OneThreeFive@98825', 
      database : 'smart-brain'
    }
  });



  

const app = express();

app.use(bodyParser.json())
app.use(cors())

app.post('/register', (req,res) => {handleRegister(req,res,db,bcrypt)})


app.post('/signin',(req,res) => {handleSignin(req,res,db,bcrypt)})


app.get('/' , (req, res) => {
    res.send(db.users);
})


app.get('/profile/:id', (req, res) => {handleProfileGet(req,res, db)} )


// app.post('/imageurl', (req,res) =>  {handleApiCall(req,res)})


app.put('/image',(req,res) => {handleImage(req,res,db)})



app.listen(3000, ()=>{
    console.log('app is running on port 3000')
})



