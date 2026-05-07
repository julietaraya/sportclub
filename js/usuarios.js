let usuariosCache = [];
let usuarioEnEdicion = null;

document.addEventListener("DOMContentLoaded", () => {
    const usuario = obtenerUsuario();
    if (usuario) {
        const navName = document.getElementById("navUserName");
        if (navName) navName.textContent = usuario.full_name || usuario.email;
    }
    cargarUsuarios();
    conectarBotones();
});

async function cargarUsuarios() {
    mostrarEstado("cargando");
    try {
        const usuarios = await apiListarUsuarios();
        usuariosCache = usuarios;
        if (usuarios.length === 0) {
            mostrarEstado("vacio");
        } else {
            renderizarTabla(usuarios);
            mostrarEstado("tabla");
        }
    } catch (error) {
        mostrarEstado("vacio");
        mostrarToast("Error al cargar usuarios: " + error.message, "danger");
    }
}

function mostrarEstado(estado) {
    document.getElementById("tablaCargando").classList.toggle("d-none", estado !== "cargando");
    document.getElementById("tablaVacia").classList.toggle("d-none", estado !== "vacio");
    document.getElementById("tablaContenedor").classList.toggle("d-none", estado !== "tabla");
}

function renderizarTabla(usuarios) {
    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = "";
    usuarios.forEach(u => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${u.id}</td>
            <td>${capitalizarNombre(u.full_name)}</td>
            <td>${(u.email || "").toLowerCase()}</td>
            <td>${badgeRol(u.role)}</td>
            <td>${formatearFecha(u.created_at)}</td>
            <td class="text-end">
                <button class="btn btn-warning btn-sm me-1" onclick="iniciarEdicion(${u.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="iniciarEliminacion(${u.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function badgeRol(rol) {
    const colores = {
        admin: "bg-danger",
        coach: "bg-primary",
        user: "bg-success"
    };
    const clase = colores[rol] || "bg-secondary";
    return `<span class="badge ${clase}">${rol}</span>`;
}

function formatearFecha(fechaIso) {
    if (!fechaIso) return "-";
    const f = new Date(fechaIso);
    const dia = String(f.getDate()).padStart(2, "0");
    const mes = String(f.getMonth() + 1).padStart(2, "0");
    const anio = f.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

function capitalizarNombre(texto) {
    if (!texto) return "";
    return texto.split(" ")
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
}

function conectarBotones() {
    document.getElementById("btnNuevoUsuario").addEventListener("click", abrirFormularioNuevo);
    document.getElementById("btnCancelar").addEventListener("click", cerrarFormulario);
    document.getElementById("btnCerrarForm").addEventListener("click", cerrarFormulario);
    document.getElementById("formUsuario").addEventListener("submit", guardarUsuario);
    document.getElementById("btnConfirmarEliminar").addEventListener("click", confirmarEliminacion);
}

function abrirFormularioNuevo() {
    usuarioEnEdicion = null;
    document.getElementById("formUsuario").reset();
    document.getElementById("usuarioId").value = "";
    limpiarErroresForm();

    document.getElementById("formTitulo").innerHTML = '<i class="bi bi-person-plus"></i> Nuevo Usuario';
    document.getElementById("grupoPassword").classList.remove("d-none");
    document.getElementById("grupoPassword2").classList.remove("d-none");

    document.getElementById("cardFormUsuario").classList.remove("d-none");
    document.getElementById("cardFormUsuario").scrollIntoView({ behavior: "smooth" });
}

async function iniciarEdicion(id) {
    try {
        const u = await apiObtenerUsuario(id);
        usuarioEnEdicion = id;

        document.getElementById("usuarioId").value = u.id;
        document.getElementById("full_name").value = u.full_name || "";
        document.getElementById("email").value = u.email || "";
        document.getElementById("role").value = u.role || "user";

        document.getElementById("grupoPassword").classList.add("d-none");
        document.getElementById("grupoPassword2").classList.add("d-none");

        document.getElementById("formTitulo").innerHTML = '<i class="bi bi-pencil"></i> Editar Usuario';
        limpiarErroresForm();
        document.getElementById("cardFormUsuario").classList.remove("d-none");
        document.getElementById("cardFormUsuario").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        mostrarToast("Error al cargar usuario: " + error.message, "danger");
    }
}

async function guardarUsuario(evento) {
    evento.preventDefault();
    limpiarErroresForm();

    const datos = {
        full_name: document.getElementById("full_name").value.trim(),
        email: document.getElementById("email").value.trim().toLowerCase(),
        role: document.getElementById("role").value
    };

    const esNuevo = usuarioEnEdicion === null;
    let password = "", password2 = "";
    if (esNuevo) {
        password = document.getElementById("password").value;
        password2 = document.getElementById("password2").value;
    }

    let hayErrores = false;
    if (!datos.full_name) {
        mostrarErrorCampo("full_name", "El nombre es obligatorio");
        hayErrores = true;
    }
    if (!datos.email) {
        mostrarErrorCampo("email", "El email es obligatorio");
        hayErrores = true;
    } else if (!validarFormatoEmail(datos.email)) {
        mostrarErrorCampo("email", "Formato de email inválido");
        hayErrores = true;
    }
    if (esNuevo) {
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
        if (!hayErrores) datos.password = password;
    }
    if (hayErrores) return;

    try {
        if (esNuevo) {
            await apiCrearUsuario(datos);
            mostrarToast("Usuario creado correctamente", "success");
        } else {
            await apiActualizarUsuario(usuarioEnEdicion, datos);
            mostrarToast("Usuario actualizado correctamente", "success");
        }
        cerrarFormulario();
        cargarUsuarios();
    } catch (error) {
        document.getElementById("alertaForm").textContent = error.message;
        document.getElementById("alertaForm").classList.remove("d-none");
    }
}

function cerrarFormulario() {
    document.getElementById("cardFormUsuario").classList.add("d-none");
    document.getElementById("formUsuario").reset();
    usuarioEnEdicion = null;
    limpiarErroresForm();
}

function limpiarErroresForm() {
    ["full_name", "email", "password", "password2"].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.classList.remove("is-invalid");
    });
    document.getElementById("alertaForm").classList.add("d-none");
}

let idAEliminar = null;

function iniciarEliminacion(id) {
    const u = usuariosCache.find(x => x.id === id);
    if (!u) return;
    idAEliminar = id;
    document.getElementById("nombreEliminar").textContent = u.full_name;
    const modal = new bootstrap.Modal(document.getElementById("modalEliminar"));
    modal.show();
}

async function confirmarEliminacion() {
    if (!idAEliminar) return;
    try {
        await apiEliminarUsuario(idAEliminar);
        bootstrap.Modal.getInstance(document.getElementById("modalEliminar")).hide();
        mostrarToast("Usuario eliminado correctamente", "success");
        cargarUsuarios();
    } catch (error) {
        mostrarToast("Error al eliminar: " + error.message, "danger");
    } finally {
        idAEliminar = null;
    }
}

function mostrarToast(mensaje, tipo = "success") {
    let contenedor = document.getElementById("toastContainer");
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "toastContainer";
        contenedor.className = "toast-container position-fixed bottom-0 end-0 p-3";
        contenedor.style.zIndex = "1100";
        document.body.appendChild(contenedor);
    }

    const id = "toast" + Date.now();
    const colorClase = tipo === "success" ? "bg-success" :
        tipo === "danger" ? "bg-danger" : "bg-primary";
    const html = `
        <div id="${id}" class="toast text-white ${colorClase}" role="alert">
            <div class="d-flex">
                <div class="toast-body">${mensaje}</div>
                <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>`;
    contenedor.insertAdjacentHTML("beforeend", html);

    const toastEl = document.getElementById(id);
    const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
    toast.show();
    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}