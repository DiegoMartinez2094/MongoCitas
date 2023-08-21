import express from 'express';
import dotenv from 'dotenv'

import appUsuario from './routers/usuario.js';

dotenv.config();
let app = express();        
app.use (express.json());

let config =JSON.parse(process.env.My_server);

app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
});

app.use("/usuario",appUsuario)