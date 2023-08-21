import { con } from "../db/atlas.js";
import {Router} from "express";

const appMedico =Router();
let db = await con();
let medico = db.collection('medico');

appMedico.get("/:esp_nombre?", async (req, res) => {
    const esp_nombre = req.params.esp_nombre;

    try {
        let db = await con();
        let medico = db.collection('medico');
        
        if (esp_nombre) {
            let result = await medico.find({ "med_especialidad.esp_nombre": esp_nombre }).toArray();
            res.send(result);
        } else {
            let result = await medico.find().toArray();
            res.send(result);
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
});



export default appMedico; 