import { con } from "../db/atlas.js";
import {Router} from "express";

const appCitas =Router();
let db = await con();
let cita = db.collection('cita');

appCitas.get("/", async(req, res) => { 
    let db = await con();
    let cita = db.collection('cita');
    let result = await cita.find().sort({ cit_codigo: 1 }).toArray();
    res.send(result); });

export default appCitas; 