let jsonData = null;

// Función para cargar el archivo JSON y guardar los datos en la variable jsonData
function cargarJSON() {
  fetch("/script/entregas.json")
    .then((response) => response.json())
    .then((data) => {
      jsonData = data;
    })
    .catch((error) => console.error("Error al cargar el archivo JSON:", error));
}

// Función para mostrar solo los Date Time de cada objeto que coincida con la razón social ingresada
function mostrarDateTimes() {
  const razonSocial = document.getElementById("razon-social").value;
  const outputDiv = document.getElementById("output");
  const mensajeDiv = document.getElementById("mensaje"); // Obtener el elemento del mensaje
  let html = "";

  for (const obj of jsonData) {
    for (const fecha in obj) {
      if (obj.hasOwnProperty(fecha)) {
        const objetoCliente = obj[fecha].objetoCliente;
        const dateTime = obj[fecha]["Date Time"];

        if (
          objetoCliente &&
          dateTime &&
          objetoCliente["razon-social"] === razonSocial
        ) {
          html += "<div>";
          html +=
            "<a href='#' onclick='mostrarDetalles(\"" +
            fecha +
            "\")'>" +
            dateTime +
            "</a>";
          html += "</div>";
        }
      }
    }
  }

  if (html === "") {
    mensajeDiv.innerHTML =
      "No se encontraron objetos con la razón social ingresada.";
    outputDiv.innerHTML = "";
    outputDiv.style.backgroundColor = ""; // Limpiar el fondo cambiado
  } else {
    mensajeDiv.innerHTML = "";
    outputDiv.innerHTML = html;
    outputDiv.style.backgroundColor = "#e4f170"; // Cambiar el fondo a amarillo (puedes cambiar el color a tu preferencia)
  }

  if (html === "") {
    mensajeDiv.innerHTML =
      "No se encontraron objetos con la razón social ingresada."; // Mostrar mensaje de error
    outputDiv.innerHTML = ""; // Limpiar el contenido del outputDiv
  } else {
    mensajeDiv.innerHTML = ""; // Limpiar mensaje de error si hubiera
    outputDiv.innerHTML = html;
  }
}

function mostrarDetalles(dateTime) {
  const outputDiv = document.getElementById("output");
  let html = "";

  for (const obj of jsonData) {
    if (obj.hasOwnProperty(dateTime)) {
      const objetoCliente = obj[dateTime].objetoCliente;
      const filasArray = obj[dateTime].filasArray;
      const piezasArray = obj[dateTime].piezasArray;
      const codigoData = obj[dateTime].codigoData;
      const user = obj[dateTime].user;

      if (objetoCliente) {
        html += "<div class='cliente-info'>";
        html += "<h2>Información del cliente:</h2>";
        html +=
          "<p><strong>Razón Social:</strong> " +
          objetoCliente["razon-social"] +
          "</p>";
        html +=
          "<p><strong>Dirección:</strong> " +
          objetoCliente["direccion"] +
          "</p>";
        html +=
          "<p><strong>Localidad:</strong> " +
          objetoCliente["localidad"] +
          "</p>";
        html +=
          "<p><strong>Provincia:</strong> " +
          objetoCliente["provincia"] +
          "</p>";
        html += "<p><strong>Zona:</strong> " + objetoCliente["zona"] + "</p>";
        html +=
          "<p><strong>Código Postal:</strong> " +
          objetoCliente["codigo-postal"] +
          "</p>";
        html += "<p><strong>CUIT:</strong> " + objetoCliente["cuit"] + "</p>";
        // Agrega más propiedades del cliente si las hay
        html += "</div>";
      }

      html += "<div class='datetime-info'>";
      html += "<h2>Fecha y Hora:</h2>";
      html += "<p>" + dateTime + "</p>";
      html += "</div>";

      html += "<div class='codigo-data'>";
      html += "<h2>Código Remito:</h2>";
      html += "<p>" + codigoData + "</p>";
      html += "</div>";

      html += "<div class='codigo-data'>";
      html += "<h2>Usuario:</h2>";
      html += "<p>" + user["name"] + "</p>";
      html += "</div>";

      // Mostrar los datos de piezasArray
      if (piezasArray && piezasArray.length > 0) {
        html += "<div class='piezas-info'>";
        html += "<h2>Piezas:</h2>";

        // Mostrar las piezas en una lista no ordenada
        html += "<ul>";
        for (const pieza of piezasArray) {
          html += "<li>";
          html += "<strong>Nombre:</strong> " + pieza.nombre + "<br>";
          html += "<strong>Cantidad:</strong> " + pieza.cantidad + "<br>";
          html += "<strong>Descripción:</strong> " + pieza.descripcion + "<br>";
          html += "</li>";
        }
        html += "</ul>";

        html += "</div>";
      } else {
        html += "<div class='piezas-info'>";
        html += "<h2>Piezas:</h2>";
        html += "<p>Remito generado con lista de materiales</p>";
        html += "</div>";
      }

      if (filasArray && filasArray.length > 0) {
        html += "<div class='filas-info'>";
        html += "<h2>Lista de materiales:</h2>";

        // Mostrar los datos de filasArray en una tabla
        html += "<table>";
        html += "<tr>";
        html += "<th>Código Pieza</th>";
        html += "<th>Item</th>";
        html += "<th>Cantidad</th>";
        html += "<th>OT</th>";
        html += "<th>Conj</th>";
        html += "<th>Iden</th>";
        html += "<th>Pos</th>";
        html += "<th>Material</th>";
        html += "<th>Espesor</th>";
        html += "<th>Largo</th>";
        html += "<th>Plano</th>";
        html += "<th>Ancho</th>";
        html += "<th>Observacion</th>";
        html += "</tr>";

        for (const fila of filasArray) {
          html += "<tr>";
          html += "<td>" + fila.CodigoPieza + "</td>";
          html += "<td>" + fila.Item + "</td>";
          html += "<td>" + fila.Cantidad + "</td>";
          html += "<td>" + fila.OT + "</td>";
          html += "<td>" + fila.Conj + "</td>";
          html += "<td>" + fila.Iden + "</td>";
          html += "<td>" + fila.Pos + "</td>";
          html += "<td>" + fila.Material + "</td>";
          html += "<td>" + fila.Espesor + "</td>";
          html += "<td>" + fila.Largo + "</td>";
          html += "<td>" + fila.Plano + "</td>";
          html += "<td>" + fila.Ancho + "</td>";
          html += "<td>" + fila.Observacion + "</td>";
          html += "</tr>";
        }

        html += "</table>";
        html += "</div>";
      } else {
        html += "<div class='filas-info'>";
        html += "<h2>Lista de materiales:</h2>";
        html += "<p>Remito generado manualmente sin lista de materiales</p>";
        html += "</div>";
      }

      break; // No necesitamos seguir buscando más objetos con el mismo Date Time
    }
  }

  outputDiv.innerHTML = html;
}

function buscarRazonesSociales() {
  const razonSocial = document
    .getElementById("razon-social")
    .value.toLowerCase();
  const resultadosDiv = document.getElementById("resultados-busqueda");
  const razonSocialResultadosDiv = document.getElementById(
    "razon-social-resultados"
  );
  let razonesSociales = [];

  if (razonSocial.length === 0) {
    resultadosDiv.innerHTML = "";
    razonSocialResultadosDiv.innerHTML = "";
    return false;
  }

  for (const obj of jsonData) {
    for (const fecha in obj) {
      if (obj.hasOwnProperty(fecha)) {
        const objetoCliente = obj[fecha].objetoCliente;
        const dateTime = obj[fecha]["Date Time"];

        if (
          objetoCliente &&
          dateTime &&
          objetoCliente["razon-social"].toLowerCase().includes(razonSocial)
        ) {
          razonesSociales.push({
            razonSocial: objetoCliente["razon-social"],
            dateTime: dateTime,
          });
        }
      }
    }
  }

  if (razonesSociales.length === 0) {
    resultadosDiv.innerHTML = "No se encontraron resultados.";
    razonSocialResultadosDiv.innerHTML = "";
  } else {
    resultadosDiv.innerHTML = "Resultados encontrados:";
    razonSocialResultadosDiv.innerHTML = razonesSociales
      .map(
        (data) =>
          `<div><a href="#" onclick="mostrarDetalles('${data.dateTime}')">${data.razonSocial} - ${data.dateTime}</a></div>`
      )
      .join("");
  }

  return false;
}

// Cargar el archivo JSON al cargar la página
cargarJSON();
