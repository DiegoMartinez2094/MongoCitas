import { con } from "../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../limit/config.js";
import { validarToken } from '../middlewares/middlewareJWT.js';

const appUsuario = Router();
let db = await con();
let usuario = db.collection("usuario");

appUsuario.get("/usuario", validarToken, limitGrt(), async (req, res) => {
  if (!req.rateLimit) return;
  console.log(req.rateLimit);

  try {
      let db = await con();
      let usuario = db.collection("usuario");

      let result = await usuario.find().sort({ usu_nombre: 1 }).toArray();
      res.send(result);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error interno del servidor");
  }
});

appUsuario.get("/usuario/:usu_id?",validarToken, limitGrt(), async (req, res) => {
  if (!req.rateLimit) return;
  console.log(req.rateLimit);
  const usu_id = req.params.usu_id ? parseInt(req.params.usu_id) : null;

  try {
    let db = await con();
    let usuario = db.collection("usuario");

    if (usu_id !== null) {
      let result = await usuario.findOne({ usu_id });
      if (result) {
        res.send(result);
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    } else {
      let result = await usuario.find().sort({ usu_nombre: 1 }).toArray();
      res.send(result);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

appUsuario.get("/usuario/NumMatriMedico/:medico_nroMatricula",validarToken,limitGrt(),async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    const medico_nroMatricula = parseInt(req.params.medico_nroMatricula);

    try {
      let db = await con();
      let cita = db.collection("cita");
      let usuario = db.collection("usuario");

      // Obtener el ID del médico a partir de su número de matrícula
      const medico = await db
        .collection("medico")
        .findOne({ med_nroMatriculaProfesional: medico_nroMatricula });

      if (!medico) {
        //si el numero de matricula no existe
        return res.status(404).send("Médico no encontrado");
      }

      // Encontrar todas las citas que tienen el ID del médico
      const citas = await cita
        .find({ cit_medico: medico.med_nroMatriculaProfesional })
        .toArray();

      const pacientesIds = citas.map((cita) => cita.cit_datosUsuario);

      // Encontrar los usuarios (pacientes) correspondientes a los IDs de pacientes obtenidos
      const pacientes = await usuario
        .find({ usu_id: { $in: pacientesIds } })
        .toArray();

      res.send(pacientes);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
);

appUsuario.get("/usuario/consultorias/:usu_id",validarToken, limitGrt(), async (req, res) => {
  if(!req.rateLimit) return; 
  console.log(req.rateLimit);
  const usu_id = parseInt(req.params.usu_id);

  try {
    let db = await con();
    let cita = db.collection("cita");
    let medico = db.collection("medico");
    let consultorio = db.collection("consultorio");

    const paciente = await db.collection("usuario").findOne({ usu_id });
    if (!paciente) {
      return res.status(404).send("Paciente no encontrado");
    }

    const pacienteCitas = await cita
      .find({ cit_datosUsuario: paciente.usu_id })
      .toArray();

    if (pacienteCitas.length === 0) {
      return res.send("El paciente no tiene consultorías programadas.");
    }

    const consultorias = [];

    for (const cita of pacienteCitas) {
      const medicoInfo = await medico.findOne({
        med_nroMatriculaProfesional: cita.cit_medico,
      });

      consultorias.push({
        medico: medicoInfo,
        cita: cita,
      });
    }

    res.send(consultorias);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

appUsuario.get("/usuario/consultorios-paciente/:usu_id",validarToken, limitGrt(),async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    const usu_id = parseInt(req.params.usu_id);

    try {
      let db = await con();
      let cita = db.collection("cita");

      let result = await cita
        .aggregate([
          {
            $match: {
              cit_datosUsuario: usu_id,
            },
          },
          {
            $lookup: {
              from: "medico",
              localField: "cit_medico",
              foreignField: "med_nroMatriculaProfesional",
              as: "medico",
            },
          },
          {
            $project: {
              _id: 0,
              consultorio: "$medico.med_consultorio.cons_nombre",
            },
          },
        ])
        .toArray();

      res.send(result);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
);

export default appUsuario;
