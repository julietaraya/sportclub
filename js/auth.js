//LOGIN
const formLogin = document.getElementById("formLogin");
if (formLogin) {
    formLogin.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        limpiarErroresLogin();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        let hayErrores = false;
        if (!email) {
            mostrarErrorCampo("email", "El email es obligatorio");
            hayErrores = true;
        } else if (!validarFormatoEmail(email)) {
            mostrarErrorCampo("email", "Formato de email inválido");
            hayErrores = true;
        }
        if (!password) {
            mostrarErrorCampo("password", "La contraseña es obligatoria");
            hayErrores = true;
        }
        if (hayErrores) return;

        try {
            const respuesta = await apiLogin(email, password);
            guardarToken(respuesta.token);
            guardarUsuario(respuesta.user);
            redirigirPorRol(respuesta.user.role);
        } catch (error) {
            mostrarAlertaGeneral(error.message || "Error al iniciar sesión");
        }
    });
}

function validarFormatoEmail(email) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(email);
}

function mostrarErrorCampo(idCampo, mensaje) {
    const input = document.getElementById(idCampo);
    const errorDiv = document.getElementById(`error${capitalizar(idCampo)}`);
    input.classList.add("is-invalid");
    if (errorDiv) errorDiv.textContent = mensaje;
}

function limpiarErroresLogin() {
    ["email", "password"].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.classList.remove("is-invalid");
    });
    const alerta = document.getElementById("alertaGeneral");
    if (alerta) alerta.classList.add("d-none");
}

function mostrarAlertaGeneral(mensaje) {
    const alerta = document.getElementById("alertaGeneral");
    alerta.textContent = mensaje;
    alerta.classList.remove("d-none");
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function redirigirPorRol(rol) {
    const rutas = {
        admin: "./admin.html",
        coach: "./coach.html",
        user: "./user.html"
    };
    window.location.href = rutas[rol] || "./user.html";
}

//REGISTRO
const formRegister = document.getElementById("formRegister");
if (formRegister) {
    formRegister.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        limpiarErroresRegister();

        const full_name = document.getElementById("full_name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;

        let hayErrores = false;
        if (!full_name) {
            mostrarErrorCampo("full_name", "El nombre es obligatorio");
            hayErrores = true;
        }
        if (!email) {
            mostrarErrorCampo("email", "El email es obligatorio");
            hayErrores = true;
        } else if (!validarFormatoEmail(email)) {
            mostrarErrorCampo("email", "Formato de email inválido");
            hayErrores = true;
        }
        if (!password) {
            mostrarErrorCampo("password", "La contraseña es obligatoria");
            hayErrores = true;
        } else if (password.length < 8) {
            mostrarErrorCampo("password", "Mínimo 8 caracteres");
            hayErrores = true;
        }
        if (password !== password2) {
            mostrarErrorCampo("password2", "Las contraseñas no coinciden");
            hayErrores = true;
        }
        if (hayErrores) return;

        try {
            await apiRegister({ full_name, email, password });
            const exito = document.getElementById("alertaExito");
            exito.textContent = "Cuenta creada. Redirigiendo al login...";
            exito.classList.remove("d-none");
            setTimeout(() => {
                window.location.href = "./login.html";
            }, 2000);
        } catch (error) {
            mostrarAlertaGeneral(error.message || "Error al registrar");
        }
    });
}

function limpiarErroresRegister() {
    ["full_name", "email", "password", "password2"].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.classList.remove("is-invalid");
    });
    const alerta = document.getElementById("alertaGeneral");
    const exito = document.getElementById("alertaExito");
    if (alerta) alerta.classList.add("d-none");
    if (exito) exito.classList.add("d-none");
}

// GUARD DE SESIÓN
function requerirSesion(rolesPermitidos = []) {
    const usuario = obtenerUsuario();
    const token = obtenerToken();

    if (!token || !usuario) {
        window.location.href = "../vistas/login.html";
        return null;
    }

    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.role)) {
        redirigirPorRol(usuario.role);
        return null;
    }
    return usuario;
}

// LOGOUT
function cerrarSesion() {
    borrarToken();
    window.location.href = "../vistas/login.html";
}

document.querySelectorAll(".btn-logout").forEach(btn => {
    btn.addEventListener("click", cerrarSesion);
});
