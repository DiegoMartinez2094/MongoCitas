
# Mongo Citas

Este archivo funciona para generar peticiones(get) controladas usando middleware de tipos de datos, cantidad de datos, limite de peticiones por token.

¿Cómo usarlo?:

1-clonar el repositorio

2- instalar node, instalar las dependencias con el comando (npm install)

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

5-corremos el archivo app.js con el comando `npm run dev` en la terminal nos saldrá el puerto de conexión del servidor.

6-con ese puerto realizamos las peticiones ejemplo:

1. **Obtener todos los pacientes alfabéticamente = http://127.0.0.1:5000/usuario**
3. **Obtener todas las citas alfabéticamente = http://127.0.0.1:5000/cita**
4. Obtener todos los médicos de una especialidad específica (por ejemplo, **'Cardiología'**)=http://127.10.10.10:5000/medico/especialidad/Ginecología
5. Encontrar la próxima cita para un paciente específico (por ejemplo, el paciente con **usu_id 1**)=
6. Encontrar todos los pacientes que tienen citas con un médico específico (por ejemplo, el médico con **med_nroMatriculaProsional 1**)=http://127.10.10.10:5000/usuario//NumMatriMedico/12345
7. Obtener las consultorías para un paciente específico (por ejemplo, paciente **con usu_id 1**)=http://127.10.10.10:5000/usuario/consultorias/1
8. Encontrar todas las citas para un día específico (por ejemplo, **'2023-07-12'**)=http://127.10.10.10:5000/cita/fecha/2023-09-01
9. **Obtener los médicos y sus consultorios =http://127.10.10.10:5000/medico/medicosYconsultorios**
10. Contar el número de citas que un médico tiene en un día específico http://127.0.0.1:5000/cita/citas-medico/12345/2023-08-25
11. **Obtener los consultorio donde se aplicó las citas de un paciente http://127.0.0.1:5000/usuario/consultorios-paciente/1**
12. **Obtener todas las citas realizadas por los pacientes de un genero si su estado de la cita fue atendidad =http://127.0.0.1:5000/cita/citas-por-genero/1/estado/Atendida**
13. Mostrar todas las citas que fueron rechazadas y en un mes específico, mostrar la fecha de la cita, el nombre del usuario y el médico.=http://127.0.0.1:5000/cita/citas-rechazadas/Rechazada/8
