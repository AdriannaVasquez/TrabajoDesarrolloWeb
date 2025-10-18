document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('register-nombre').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const confirm_password = document.getElementById('register-confirm-password').value.trim();

    if (!nombre || !email || !password || !confirm_password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (password !== confirm_password) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const apiUrl = "https://c6vix0f64k.execute-api.us-east-1.amazonaws.com/v1/registro";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          confirm_password
        })
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.isSuccess) {
        alert("✅ Usuario registrado exitosamente");
        form.reset();
      } else {
        alert("❌ Error: " + data.errorMessage);
      }

    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("⚠️ Error de conexión. Revisa la consola o el endpoint.");
    }
  });
});
