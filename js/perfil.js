let perfilOriginal = null;

document.addEventListener("DOMContentLoaded", () => {
    cargarPerfil();
    conectarBotonesPerfil();
});

async function cargarPerfil() {
    try {
        const u = await apiMiPerfil();
        perfilOriginal = u;
        pintarPerfil(u);

        const linkInicio = document.getElementById("linkInicio");
        if (linkInicio) {
            const rutas = {
                admin: "./admin.html",
                coach: "./coach.html",
                user: "./user.html"
            };
            linkInicio.href = rutas[u.role] || "./user.html";
        }
    } catch (error) {
        mostrarToast("Error al cargar perfil: " + error.message, "danger");
    }
}
function pintarPerfil(u) {
    document.getElementById("perfilNombre").textContent = capitalizarNombre(u.full_name);
    document.getElementById("perfilEmailLista").textContent = (u.email || "").toLowerCase();
    document.getElementById("perfilRolLista").textContent = u.role;
    document.getElementById("perfilNacimiento").textContent = formatearFecha(u.birth_date);
    document.getElementById("perfilRegistro").textContent = formatearFecha(u.created_at);
    document.getElementById("perfilBadgeRol").innerHTML = badgeRol(u.role);

    const subtitulos = {
        admin: "Administrador del Sistema",
        coach: "Entrenador",
        user: "Usuario del Sistema"
    };
    document.getElementById("perfilSubtitulo").textContent = subtitulos[u.role] || "Usuario";

    document.getElementById("full_name").value = u.full_name || "";
    document.getElementById("email").value = (u.email || "").toLowerCase();
    document.getElementById("birth_date").value = u.birth_date ? u.birth_date.split("T")[0] : "";
    document.getElementById("favorite_sport").value = u.favorite_sport || "";
    document.getElementById("metadata").value = (typeof u.metadata === 'string' ? u.metadata : '') || "";
}
function conectarBotonesPerfil() {
    document.getElementById("btnEditarPerfil").addEventListener("click", activarEdicion);
    document.getElementById("btnCancelarPerfil").addEventListener("click", cancelarEdicion);
    document.getElementById("formPerfil").addEventListener("submit", guardarPerfil);
    document.getElementById("formPassword").addEventListener("submit", cambiarPassword);
}
function activarEdicion() {
    ["full_name", "birth_date", "favorite_sport", "metadata"].forEach(id => {
        document.getElementById(id).disabled = false;
    });
    document.getElementById("botonesPerfil").classList.remove("d-none");
    document.getElementById("btnEditarPerfil").classList.add("d-none");
}

function cancelarEdicion() {
    pintarPerfil(perfilOriginal);
    desactivarEdicion();
}

function desactivarEdicion() {
    ["full_name", "birth_date", "favorite_sport", "metadata"].forEach(id => {
        document.getElementById(id).disabled = true;
        document.getElementById(id).classList.remove("is-invalid");
    });
    document.getElementById("botonesPerfil").classList.add("d-none");
    document.getElementById("btnEditarPerfil").classList.remove("d-none");
    document.getElementById("alertaPerfil").classList.add("d-none");
}
async function guardarPerfil(evento) {
    evento.preventDefault();
    document.getElementById("full_name").classList.remove("is-invalid");

    const datos = {
        full_name: document.getElementById("full_name").value.trim(),
        birth_date: document.getElementById("birth_date").value || null,
        favorite_sport: document.getElementById("favorite_sport").value.trim(),
        metadata: document.getElementById("metadata").value.trim()
    };

    if (!datos.full_name) {
        mostrarErrorCampo("full_name", "El nombre es obligatorio");
        return;
    }

    try {
        const actualizado = await apiActualizarMiPerfil(datos);
        perfilOriginal = actualizado;
        guardarUsuario(actualizado);
        pintarPerfil(actualizado);
        desactivarEdicion();

        const alerta = document.getElementById("alertaPerfil");
        alerta.textContent = "Perfil actualizado correctamente";
        alerta.classList.remove("d-none");
        setTimeout(() => alerta.classList.add("d-none"), 3000);
    } catch (error) {
        mostrarToast("Error al guardar: " + error.message, "danger");
    }
}
async function cambiarPassword(evento) {
    evento.preventDefault();
    limpiarErroresPassword();

    const current_password = document.getElementById("current_password").value;
    const new_password = document.getElementById("new_password").value;
    const new_password2 = document.getElementById("new_password2").value;

    let hayErrores = false;
    if (!current_password) {
        mostrarErrorCampo("current_password", "Ingresa tu contraseña actual");
        hayErrores = true;
    }
    if (!new_password) {
        mostrarErrorCampo("new_password", "Ingresa la nueva contraseña");
        hayErrores = true;
    } else if (new_password.length < 8) {
        mostrarErrorCampo("new_password", "Mínimo 8 caracteres");
        hayErrores = true;
    }
    if (new_password !== new_password2) {
        mostrarErrorCampo("new_password2", "Las contraseñas no coinciden");
        hayErrores = true;
    }
    if (hayErrores) return;

    try {
        await apiCambiarPassword({ current_password, new_password });
        document.getElementById("formPassword").reset();
        mostrarToast("Contraseña actualizada correctamente", "success");
    } catch (error) {
        document.getElementById("alertaPassword").textContent = error.message;
        document.getElementById("alertaPassword").classList.remove("d-none");
    }
}

function limpiarErroresPassword() {
    ["current_password", "new_password", "new_password2"].forEach(id => {
        document.getElementById(id).classList.remove("is-invalid");
    });
    document.getElementById("alertaPassword").classList.add("d-none");
}
function badgeRol(rol) {
    const colores = {
        admin: "bg-danger",
        coach: "bg-primary",
        user: "bg-success"
    };
    return `<span class="badge ${colores[rol] || "bg-secondary"}">${rol}</span>`;
}

function formatearFecha(iso) {
    if (!iso) return "-";
    const f = new Date(iso);
    return `${String(f.getDate()).padStart(2, "0")}/${String(f.getMonth() + 1).padStart(2, "0")}/${f.getFullYear()}`;
}

function capitalizarNombre(t) {
    if (!t) return "";
    return t.split(" ")
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
}