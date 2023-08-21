import { con } from "../db/atlas.js";
import {Router} from "express";

const appUsuario =Router();
let db = await con();
let usuario = db.collection('usuario');

appUsuario.get("/", async(req, res) => { 
    let db = await con();
    let usuario = db.collection('usuario');
    let result = await usuario.find().sort({ usu_nombre: 1 }).toArray();
    res.send(result); });

export default appUsuario; 