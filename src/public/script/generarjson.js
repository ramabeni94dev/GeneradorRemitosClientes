let objetoJSON;

document.getElementById("subirBtn").addEventListener("click", generarJSON);
function generarJSON() {
  const razonSocial = document.getElementById("razonSocial").value;
  const nombreFantasia = document.getElementById("nombreFantasia").value;
  const cuit = document.getElementById("cuit").value;
  const direccion1Fact = document.getElementById("direccion1Fact").value;
  const localidadFact = document.getElementById("localidadFact").value;
  const codPostalFact = document.getElementById("codPostalFact").value;
  const provinciaIdFact = document.getElementById("provinciaIdFact").value;
  const email = document.getElementById("email").value;
  const telefonos = document.getElementById("telefonos").value;
  const condFiscId = document.getElementById("condFiscId").value;
  const zona = document.getElementById("DescripcionZona").value;

  if (
    razonSocial === "" ||
    nombreFantasia === "" ||
    cuit === "" ||
    direccion1Fact === "" ||
    localidadFact === "" ||
    codPostalFact === "" ||
    provinciaIdFact === "" ||
    email === "" ||
    telefonos === "" ||
    zona === "" ||
    condFiscId === ""
  ) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, complete todos los campos antes de generar el objeto JSON.",
    });
    return;
  }

  objetoJSON = {};
  objetoJSON[razonSocial] = {
    RazonSocial: razonSocial,
    NombreFantasia: nombreFantasia,
    Cuit: cuit,
    Direccion1_Fact: direccion1Fact,
    Localidad_Fact: localidadFact,
    CodPostal_Fact: codPostalFact,
    Provincia_id_Fact: provinciaIdFact,
    EMail: email,
    Telefonos: telefonos,
    CondFisc_Id: condFiscId,
    DescripcionZona: zona,
  };

  const formattedContent = Object.keys(objetoJSON[razonSocial])
    .map((key) => `${key}: ${objetoJSON[razonSocial][key]}`)
    .join(",\n");

  const resultadoElement = document.getElementById("resultado");
  resultadoElement.textContent = formattedContent;
  resultadoElement.classList.add("formatted-content");

  const url = "/guardarCliente"; // Ruta relativa a la ubicación actual

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objetoJSON),
  })
    .then((response) => response.json())
    .then((data) => {
      // Puedes mostrar una alerta o realizar alguna acción con la respuesta del servidor
      Swal.fire({
        icon: data.success ? "success" : "error",
        title: data.success ? "Éxito" : "Error",
        text: data.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar el cliente en el servidor.",
      });
      console.error(error);
    });
}

function enviarPorWhatsApp() {
  if (objetoJSON) {
    const mensaje = encodeURIComponent(formatWhatsAppMessage(objetoJSON));
    const url = `https://api.whatsapp.com/send?text=${mensaje}`;
    window.open(url);
  } else {
    Swal.fire({
      icon: "info",
      title: "CLIENTE no generado",
      text: "Primero debes cargar un Cliente.",
    });
  }
  return false;
}

function formatWhatsAppMessage(jsonObj) {
  let formattedMessage = "¡Nuevo cliente agregado!\n\n";
  formattedMessage += "Estos son los detalles del cliente:\n\n";

  const obj = jsonObj[Object.keys(jsonObj)[0]];
  for (let prop in obj) {
    formattedMessage += `${prop}: ${obj[prop]}\n`;
  }

  return formattedMessage;
}

function enviarPorEmail() {
  if (objetoJSON) {
    const razonSocial = Object.keys(objetoJSON)[0];
    const subject = `cliente nuevo: ${razonSocial}`;
    const body = formatEmailBody(objetoJSON);
    const email = "dorrego@gottert.com.ar";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  } else {
    Swal.fire({
      icon: "info",
      title: "CLIENTE no generado",
      text: "Primero debes cargar un Cliente.",
    });
  }
  return false;
}

function formatEmailBody(jsonObj) {
  let formattedBody = "¡Nuevo cliente agregado!\n\n";
  formattedBody += "Estos son los detalles del cliente:\n\n";

  const obj = jsonObj[Object.keys(jsonObj)[0]];
  for (let prop in obj) {
    formattedBody += `${prop}: ${obj[prop]}\n`;
  }

  return formattedBody;
}
