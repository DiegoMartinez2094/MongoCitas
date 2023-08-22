import { con } from "../db/atlas.js";
import { Router } from "express";

const appCitas = Router();
let db = await con();
let cita = db.collection("cita");

appCitas.get("/", async (req, res) => {
  let db = await con();
  let cita = db.collection("cita");
  let result = await cita.find().sort({ cit_codigo: 1 }).toArray();
  res.send(result);
});

appCitas.get("/fecha/:cit_fecha", async (req, res) => {
    const cit_fecha = req.params.cit_fecha;

    try {
        let db = await con();
        let cita = db.collection('cita');
        if (cit_fecha) {
            let result = await cita.find({ "cit_fecha": new Date(cit_fecha) }).toArray();
            res.send(result);
        } else {
            res.status(400).send("Fecha de cita inválida");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
});



export default appCitas;
