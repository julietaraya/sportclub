function logout(){
    localStorage.removeItem("user");
    window.location.href = "landing_page.html";
}
