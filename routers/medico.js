import { con } from "../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../limit/config.js";

const appMedico = Router();
let db = await con();
let medico = db.collection("medico");

appMedico.get("/especialidad/:esp_nombre", limitGrt(), async (req, res) => {
  if (!req.rateLimit) return;
  console.log(req.rateLimit);
  const esp_nombre = req.params.esp_nombre;

  try {
    let db = await con();
    let medico = db.collection("medico");

    let result = await medico
      .find({ "med_especialidad.esp_nombre": esp_nombre })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

appMedico.get("/medicosYconsultorios", limitGrt(), async (req, res) => {
  if (!req.rateLimit) return;
  console.log(req.rateLimit);
  try {
    let db = await con();
    let medico = db.collection("medico");

    let result = await medico
      .find()
      .project({
        _id: 0,
        med_nombreCompleto: 1,
        "med_consultorio.cons_nombre": 1,
      })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default appMedico;
