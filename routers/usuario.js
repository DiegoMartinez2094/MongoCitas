import { con } from "../db/atlas.js";
import { Router } from "express";

const appUsuario = Router();
let db = await con();
let usuario = db.collection("usuario");

appUsuario.get("/:usu_id?", async (req, res) => {
    const usu_id = req.params.usu_id ? parseInt(req.params.usu_id) : null;

    try {
        let db = await con();
        let usuario = db.collection('usuario');
        
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


export default appUsuario;
