# Mongo Citas

Este archivo funciona para generar peticiones(get) controladas usando middleware de tipos de datos, cantidad de datos, limite de peticiones por token.

##### ¿Cómo usarlo?:

1-clonar el repositorio.

2- instalar node, instalar las dependencias con el comando:

```
npm install
```

3-verificar las variables de entorno en el archivo . env.example (conexion del servidor y de la base de datos en Atlas):

```
My_server={"hostname":"127.10.10.10", "port":"5000"}
ATLAS_USER="nombreusuario"
ATLAS_PASSWORD="contraseña"
ATLAS_DB="Citas"
```

4- conectar la base de datos con la extension de visual estudio ( **MongoDB for VS Code** ) la de la hojita verde.

-ingresamos a la extensión oprimimos conectar nos pedirá el link de conexion de la base de datos la cuál encontraremos en la pagina Atlas(ingresamos con el correo, en la parte izquierda la opcion Database, luego en la opción connect, MongoDB for VS code, opción 3)

-Obtenemos un link de esta manera:

| mongodb+srv://nombreusuario:`<password>`@cluster0.vzylork.mongodb.net/ |
| ------------------------------------------------------------------------ |

en el cuál cambiaremos el usuario,la `<password>` y damos enter

en la parte derecha de la extensión nos saldrá una hoja de color verde que nos indica conexión exitosa.

-seguido de ello corremos el archivo db/base_datos.mongodb en la parte superior derecha encontramos un comando de un trinagulo que nos indica la opción Mongo Run.

5-corremos el archivo app.js con el comando

```
npm run dev
```

 en la terminal nos saldrá el puerto de conexión del servidor.

6-con ese puerto realizamos las peticiones ejemplo:

En todas las solicitudes se debe implementar un token, este token va de acuerdo al rol, en este caso está configurado de la siguiente forma en la base de datos en la coleccion roles:

Nota1: el token tiene una duración de 1 minuto, se puede modificar en el archivo middlewares/middlewareJWT.js crearToken/.setExpirationTime('1m')
Nota 2: si generamos el Token administrador: tiene acceso a todos los endpoints, para los endpoints relacionados a citas, sirve cualquier rol.

si realizas una solicitud con un token que ya caducó con el tiempo, saldrá el siguiente mensaje:

```
{
  "mensaje": "Token inválido"
}
```

si realizas la generación del token con un rol que no existe saldrá el siguiente mensaje:

```
{
  "mensaje": "Rol no encontrado"
}
```

si realizamos una solicitud con un token incorrecto nos saldrá el siguiente mensaje: 

```
{
  "mensaje": "Acceso no autorizado a la colección"
}
```

si generamos una solicitud sin dar en los headers la Autorizacion del token nos saldrá un mensaje de la siguiente forma:

```
{
  "mensaje": "Token no proporcionado"
}
```

```

 {
    nombre_rol: "usuario",
    acceso_rol: ["cita", "usuario"]
  },
  {
    nombre_rol: "medico",
    acceso_rol: ["cita", "medico"]
  },
  {
    nombre_rol: "administrador",
    acceso_rol: ["cita", "usuario", "medico"]
  }
```

1. Obtener todos los pacientes alfabéticamente =
   se obtiene el token por rol: http://127.10.10.10:5000/token/usuario
   y se realiza la consulta con el siguiente endpoint:
   http://127.0.0.1:5000/usuario/usuario
2. Obtener todas las citas alfabéticamente = se obtiene el token por rol: http://127.10.10.10:5000/token/medico, http://127.10.10.10:5000/token/usuario
   se pone en los headeres Authorization el token y se realiza la consulta con el siguiente endpoint: http://127.10.10.10:5000/cita/cita
3. Obtener todos los médicos de una especialidad específica (por ejemplo, 'Cardiología')=
   se obtiene el token por rol: http://127.10.10.10:5000/token/medico
   se pone en los headeres Authorization el token y se realiza la consulta con el siguiente endpoint:
   http://127.10.10.10:5000/medico/medico/especialidad/Ginecología
4. Encontrar todos los pacientes que tienen citas con un médico específico (por ejemplo, el médico con med_nroMatriculaProsional 1)=se obtiene el token por rol: http://127.10.10.10:5000/token/usuario
   y se realiza la consulta con el siguiente endpoint:
   http://127.10.10.10:5000/usuario/usuario/NumMatriMedico/12345
5. Obtener las consultorías para un paciente específico (por ejemplo, paciente con usu_id 1)=se obtiene el token por rol: http://127.10.10.10:5000/token/usuario
   y se realiza la consulta con el siguiente endpoint:
   http://127.10.10.10:5000/usuario/usuario/consultorias/1
6. Encontrar todas las citas para un día específico (por ejemplo, '2023-07-12')=se obtiene el token por rol: http://127.10.10.10:5000/token/usuario, http://127.10.10.10:5000/token/medico
   y se realiza la consulta con el siguiente endpoint: http://127.10.10.10:5000/cita/fecha/2023-09-01
7. Obtener los médicos y sus consultorios =se obtiene el token por rol: http://127.10.10.10:5000/token/medico
   se pone en los headeres Authorization el token y se realiza la consulta con el siguiente endpoint:http://127.10.10.10:5000/medico/medico/medicosYconsultorios
8. Contar el número de citas que un médico tiene en un día específico= se obtiene el token por rol: http://127.10.10.10:5000/token/usuario, http://127.10.10.10:5000/token/medico
   y se realiza la consulta con el siguiente endpoint: http://127.0.0.1:5000/cita/citas-medico/12345/2023-08-25
9. Obtener los consultorio donde se aplicó las citas de un paciente=se obtiene el token por rol: http://127.10.10.10:5000/token/usuario
   y se realiza la consulta con el siguiente endpoint:
   http://127.0.0.1:5000/usuario/usuario/consultorios-paciente/1
10. Obtener todas las citas realizadas por los pacientes de un genero si su estado de la cita fue atendidad = se obtiene el token por rol: http://127.10.10.10:5000/token/usuario, http://127.10.10.10:5000/token/medico
    y se realiza la consulta con el siguiente endpoint: http://127.0.0.1:5000/cita/citas-por-genero/1/estado/Atendida
11. Mostrar todas las citas que fueron rechazadas y en un mes específico, mostrar la fecha de la cita, el nombre del usuario y el médico.= se obtiene el token por rol: http://127.10.10.10:5000/token/usuario, http://127.10.10.10:5000/token/medico
    y se realiza la consulta con el siguiente endpoint: http://127.0.0.1:5000/cita/citas-rechazadas/Rechazada/8

Nota: cada solicitud tiene un limite de 5 peticiones máximo en 30 segundos.
