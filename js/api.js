const API_URL = "http://localhost:3000/api";

function guardarToken(token) {
    localStorage.setItem("token", token);
}

function obtenerToken() {
    return localStorage.getItem("token");
}

function borrarToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

function guardarUsuario(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

function obtenerUsuario() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
}

async function apiRequest(endpoint, opciones = {}) {
    const headers = {
        "Content-Type": "application/json"
    };

    const token = obtenerToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        method: opciones.method || "GET",
        headers: headers
    };

    if (opciones.body) {
        config.body = JSON.stringify(opciones.body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        if (response.status === 401) {
            borrarToken();
            window.location.href = "../vistas/login.html";
            throw new Error("Sesión expirada");
        }

        const respuesta = response.status !== 204
            ? await response.json()
            : null;
        if (!response.ok) {
            throw new Error(respuesta?.message || `Error ${response.status}`);
        }
        return respuesta?.data ?? respuesta;
    } catch (error) {
        console.error("Error en apiRequest:", error);
        throw error;
    }
}

const apiLogin    = (email, password) => apiRequest("/auth/login",
                    { method: "POST", body: { email, password } });
const apiRegister = (datos) => apiRequest("/auth/register",
                    { method: "POST", body: datos });
const apiMiPerfil = () => apiRequest("/auth/me");
const apiActualizarMiPerfil = (datos) => apiRequest("/auth/me",
                    { method: "PUT", body: datos });
const apiCambiarPassword = (datos) => apiRequest("/auth/me/password",
                    { method: "PUT", body: datos });
const apiListarUsuarios = () => apiRequest("/users");
const apiObtenerUsuario = (id) => apiRequest(`/users/${id}`);
const apiCrearUsuario = (datos) => apiRequest("/users",
                    { method: "POST", body: datos });
const apiActualizarUsuario = (id, datos) => apiRequest(`/users/${id}`,
                    { method: "PUT", body: datos });
const apiEliminarUsuario = (id) => apiRequest(`/users/${id}`,
                    { method: "DELETE" });