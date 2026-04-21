const users = [
    { email: "admin@club.com", password: "123", role: "admin" },
    { email: "coach@club.com", password: "123", role: "coach" },
    { email: "user@club.com", password: "123", role: "user" }
];

    function login(){
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user = users.find(u => u.email === email && u.password === password);
        console.log("login ejecutado");
        if(!user){
            alert("Credenciales incorrectas");
            return;
        }

    // 💾 GUARDAR SESIÓN
        localStorage.setItem("user", JSON.stringify(user));

    // 🔀 REDIRECCIÓN POR ROL
        if(user.role === "admin"){
            window.location.href = "admin.html";
        }
        else if(user.role === "coach"){
            window.location.href = "coach.html";
        }
        else{
            window.location.href = "user.html";
        }
        }

        function logout(){
            localStorage.removeItem("user");
            window.location.href = "index.html";
        }

        const user = JSON.parse(localStorage.getItem("user"));

        if(user){
            console.log("Bienvenido:", user.email);
        }
