function generarCodigoUnico() {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigo = "";

  for (let i = 0; i < 5; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres.charAt(indiceAleatorio);
  }

  return codigo;
}

// Obtener el elemento div con ID "codigo"
const codigoElement = document.getElementById("codigo");

// Generar el código único
const codigoUnico = generarCodigoUnico();

// Mostrar el código generado en el div
codigoElement.textContent = codigoUnico;
