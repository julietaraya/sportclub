Uso de la IA

Herramienta utilizada: ChatGPT, Copilot

Fecha: 25/03 - 13/04

Prompt utilizado:

1-"Dame la estructura básica para HTML"
2-"Cómo poner un separador en CSS"
3-"¿Cómo puedo poner los vínculos '¿Olvidaste tu contraseña?' y 'Registrarse' en una misma línea dentro del formulario?" (también pegué esa parte de mi código en el prompt)
4-"mi codigo css no está funcionando, cuando hago los cambios en image-box, registrarse y change password no pasa nada"
5-"¿Por qué no se ve el color de fondo en mi código?"
6- Cómo puedo hacer un contenedor para mi imagen de logo.
7- como puedo cambiar el color de cuando se selecciona la caja de email y contraseña.
8- Le consulté a chat gpt sobre como hacer el inicio de sesión de cada credencial con su respectivo correo y contraseña.

Resultado generado: 

1: Me dio la estructura básica base de HTML para comenzar a editar.
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Descripción de tu página">
    <title>titulo/title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
<h1>Encabezado principal</h1>
    <p>Este es un párrafo de ejemplo.</p>
</body>
</html>

2: .separador{
    border-top:1px solid #000;
    margin:20px 0 10px 0;
}

<div class="separador"></div>

3: <div class="container">
    <a href="#">¿Olvidaste tu contraseña?</a>
    <span>|</span>
    <a href="#">Registrarse</a>
</div>

4:Si quieres ver cambios visibles, prueba:
	.formulario .change-password{
    text-align: center;
    margin-top: 10px;
}

.formulario .registrarse{
    text-align: center;
    margin-top: 5px;
}

5:Cambia tu body por esto:

body{
    margin: 0;
    min-height: 100vh;
    font-family: 'Times New Roman', Times, serif;
    background: linear-gradient(#97a6ff, #9dd8ff, #ffffff, #f1f1f1);
    background-repeat: no-repeat;
}

100vh asegura que el fondo cubra toda la pantalla. 

6: 
Agrega algo así:

.formulario .image-box{
    border: 2px solid #000;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #f7f7f7;
    text-align: center;
}

Tu HTML debería quedar así
<div class="image-box">
    <img src="../img/logo_empresa_letra_v1.png" alt="Logo empresa">
</div>

7-
.formulario input{
    border:1px solid #ccc;
    border-radius:5px;
    padding:8px;
}


.formulario input:focus{
    border: 2px solid #3c8ebd;
    background-color: #eef7ff;
    outline: none;
}

Modificaciones realizadas:

1: Usé la estructura que me dio como base para mi código.

2: agregué el separador en HTML donde lo necesitaba y luego en CSS y le agregue algunas sombras.

3:agregué ese resultado a mi código y resolvió el problema.

4: le agregué margin-top a mi código para ver cambios.
quité el padding de body que me estaba generando error. También tenía un error de ortografía en method.

5: agregué min-height: 100vh; en mi código css.

6: agregué el resultado y lo modifiqué en mi código.

7: agregué input de formulario en css como se indicó y cambié los colores.

8: Se usó todo el código entregado por la IA en login.js y sessions.js, aparte de algunos ajustes necesarios en cada dashboard para que pudiera funcionar correctamente el código sin errores.


Justificación:

Todo uso de la IA en el desarrollo de mi código fue para comenzar desde una buena base, aclarar dudas, resolver errores y entender algunas funciones del código.


OTROS HERRAMIENTAS UTILIZADAS:
YouTube: 

https://youtu.be/XPrs9nqiYOc?si=oF5GALuUq8O1iULR

https://youtu.be/HQyKaI0hvPY?si=75_9H5RdeDqw2jYg

Grabación de Teams de la clase del Alex Diaz sobre HTML y CSS.

		
