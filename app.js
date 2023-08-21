import express from 'express';
import dotenv from 'dotenv'

import appUsuario from './routers/usuario.js';
import appCitas from './routers/citas.js';
import appMedico from './routers/medico.js';

dotenv.config();
let app = express();        
app.use (express.json());

let config =JSON.parse(process.env.My_server);

app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
});

app.use("/usuario",appUsuario);
app.use("/cita",appCitas);
app.use("/medico",appMedico);