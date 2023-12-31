import { SignJWT, jwtVerify } from "jose";
import {con} from "../db/atlas.js";
import dotenv from 'dotenv';
dotenv.config();

const conexionDB = await con();


const crearToken = async (req, res) => {
    const encoder = new TextEncoder();
    const roles = {
        medico: ["citas", "medico"],
        usuario: ["citas", "usuario"],
        administrador: ["citas", "usuario", "medico"]
    };

    const rol = req.params.rol;
    if (!roles[rol]) {
        return res.status(400).json({ mensaje: "Rol no encontrado" });
    }

    // Crear el token con los permisos del rol
    const jwtConstructor = await new SignJWT({ rol: rol }) // Configurar el rol en el token
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('1m')
        .sign(encoder.encode(process.env.JWT_SECRET));
    res.send(jwtConstructor);
}


const validarToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    try {
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            token,
            encoder.encode(process.env.JWT_SECRET)
        );

        // Obtener el rol del token
        const rol = jwtData.payload.rol;
        console.log("Rol obtenido:", rol); // Imprimir el rol en la consola

        // Obtener la colección de la URL
        const urlParts = req.url.split("/");
        console.log("partes url:", urlParts[1]);
        
        let coleccionIndex = urlParts.findIndex(part => part === "medico" || part === "usuario" || part === "cita");

        if (coleccionIndex === -1) {
            return res.status(400).json({ mensaje: "Colección no encontrada en la URL" });
        }
        const coleccion = urlParts[coleccionIndex];

        console.log("Colección obtenida:", coleccion); // Imprimir la colección en la consola
        
        // Buscar el rol en la colección roles
        const rolesData = await conexionDB.collection('roles').findOne({ nombre_rol: rol });

        if (!rolesData) {
            return res.status(401).json({ mensaje: "Rol no encontrado" });
        }

        const accesoColecciones = rolesData.acceso_rol;

        if (accesoColecciones.some(acceso => acceso === coleccion)) {
            // Usuario tiene acceso a la colección específica
            next();
        } else {
            return res.status(403).json({ mensaje: "Acceso no autorizado a la colección" });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ mensaje: "Token inválido" });
    }
}



export {
    crearToken,
    validarToken
}
