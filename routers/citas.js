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

appCitas.get("/citas-medico/:med_nroMatriculaProfesional/:fecha", async (req, res) => {
    const med_nroMatriculaProfesional = parseInt(req.params.med_nroMatriculaProfesional);
    const fecha = new Date(req.params.fecha);

    try {
        let db = await con();
        let cita = db.collection('cita');
        
        let result = await cita.aggregate([
            {
                $match: {
                    cit_medico: med_nroMatriculaProfesional,
                    cit_fecha: fecha
                }
            },
            {
                $group: {
                    _id: "$cit_medico",
                    totalCitas: { $sum: 1 }
                }
            }
        ]).toArray();

        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
});

appCitas.get("/citas-por-genero/:gen_id/estado/:estado", async (req, res) => {
    const gen_id = parseInt(req.params.gen_id);
    const estado = req.params.estado;

    try {
        let db = await con();
        let cita = db.collection('cita');
        
        let result = await cita.aggregate([
            {
                $lookup: {
                    from: "usuario",
                    localField: "cit_datosUsuario",
                    foreignField: "usu_id",
                    as: "usuario"
                }
            },
            {
                $match: {
                    "usuario.usu_genero.gen_id": gen_id,
                    "cit_estadoCita.est_cita_nombre": estado
                }
            },
            {
                $project: {
                    _id: 0,
                    cit_codigo: 1,
                    cit_fecha: 1,
                    cit_estadoCita: 1,
                    cit_medico: 1,
                    cit_datosUsuario: 1
                }
            }
        ]).toArray();

        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
});





export default appCitas;
