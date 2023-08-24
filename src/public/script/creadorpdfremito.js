document
  .getElementById("miBotonGenerarObjeto")
  .addEventListener("click", generarPDF);

function generarPDF() {
  // Obtiene el contenido de los elementos por su ID
  const dateTime = document.getElementById("dateTime").innerText;
  const codigo = document.getElementById("codigo").innerText;
  const modo = document.getElementById("Modo").value;
  const numRef = document.getElementById("numRef").value; // Utilizamos "value" para obtener el valor del input

  // Crea un objeto jsPDF
  const doc = new jsPDF();

  // Tamaño de letra reducido para el contenido del cliente
  const fontSizeCliente = 8;
  const fontSizeResto = 8; // Tamaño de letra reducido para el resto del contenido

  // Obtiene el contenido del cliente y divide en líneas que se ajusten al ancho de la mitad izquierda
  const clienteRazonSocial = document.getElementById("razon-social").innerText;
  const clienteDireccion = document.getElementById("direccion").innerText;
  const clienteLocalidad = document.getElementById("localidad").innerText;
  const clienteProvincia = document.getElementById("provincia").innerText;
  const clienteZona = document.getElementById("zona").innerText;
  const clienteCodigoPostal =
    document.getElementById("codigo-postal").innerText;
  const clienteCuit = document.getElementById("cuit").innerText;

  // Calcula el ancho de la mitad izquierda (para las dos primeras columnas)
  const columnWidth = doc.internal.pageSize.width / 2;

  // Posiciona el contenido del cliente en dos mitades con tamaño de letra reducido
  let xPos1 = 20;
  let xPos2 = doc.internal.pageSize.width / 2 + 10;
  let yPos = 70; // Ajustamos la posición vertical para bajar más el contenido

  doc.setFontSize(fontSizeCliente); // Aplicar tamaño de letra reducido

  // Coloca el contenido del cliente en la primera columna (mitad izquierda)
  doc.text(xPos1, yPos, "Razón Social: " + clienteRazonSocial);
  doc.text(xPos1, yPos + 8, "Direccion: " + clienteDireccion); // Reducimos aún más la distancia vertical
  doc.text(xPos1, yPos + 16, "Localidad: " + clienteLocalidad); // Reducimos aún más la distancia vertical
  doc.text(xPos1, yPos + 24, "Provincia: " + clienteProvincia); // Reducimos aún más la distancia vertical
  doc.text(xPos1, yPos + 32, "Código: " + codigo); // Reducimos aún más la distancia vertical

  // Reseteamos la posición vertical para la segunda columna (mitad derecha)
  yPos = 70; // Ajustamos la posición vertical para bajar más el contenido

  // Coloca el contenido del cliente en la segunda columna (mitad derecha)
  doc.text(xPos2, yPos, "Zona: " + clienteZona);
  doc.text(xPos2, yPos + 8, "Código Postal: " + clienteCodigoPostal);
  doc.text(xPos2, yPos + 16, "Cuit: " + clienteCuit);
  doc.text(xPos2, yPos + 24, "Modo: " + modo);
  doc.text(xPos2, yPos + 32, "Número de Referencia: " + numRef);

  // Continuamos con el resto del contenido
  doc.setFontSize(fontSizeResto); // Aplicar tamaño de letra reducido

  // Obtiene la anchura del texto "Fecha y Hora: " para colocarlo en la esquina superior izquierda
  const dateTimeWidth =
    (doc.getStringUnitWidth("Fecha y Hora: ") * fontSizeResto) /
    doc.internal.scaleFactor;

  // Ajustamos la posición horizontal para mover más a la derecha
  const xPosDateTime = doc.internal.pageSize.width - dateTimeWidth - 50;

  // Coloca el contenido de "dateTime" en la esquina superior izquierda con la nueva posición horizontal
  doc.text(xPosDateTime, 30, dateTime);

  yPos += (fontSizeResto + 2) * 5; // Ajustamos la posición vertical para bajar más el contenido

  // Obtiene el contenido del elemento con id "listaPiezas"
  const listaPiezas = document.getElementById("listaPiezas");

  // Obtiene todos los elementos <li> dentro del elemento con id "listaPiezas"
  const piezasLiElements = listaPiezas.querySelectorAll("li");

  // Tamaño de letra reducido
  const fontSizeResto1 = 10;

  // Posición inicial en el eje Y
  let currentYPos = yPos;

  // Itera sobre cada elemento <li> que representa una pieza
  for (let i = 0; i < piezasLiElements.length; i++) {
    const piezaIndex = piezasLiElements[i].querySelector(
      "p[id^='piezaIndex']"
    ).innerText;
    const piezaCantidad = piezasLiElements[i].querySelector(
      "p[id^='piezaCantidad']"
    ).innerText;
    const piezaDescripcion = piezasLiElements[i].querySelector(
      "p[id^='piezaDescripcion']"
    ).innerText;

    // Combina los datos de la pieza en una sola cadena con un formato específico
    const piezaTexto = `${piezaIndex} ${piezaCantidad} ${piezaDescripcion}`;

    doc.text(piezaTexto, 15, currentYPos);
    currentYPos += 5; // Aumenta la posición en el eje Y para la siguiente línea
  }

  const modoSelect = document.getElementById("modo");

  // Verificar si el select "modo" tiene seleccionada la opción "FORMA MANUAL"
  if (modoSelect.value === "manual") {
    // Si la opción "FORMA MANUAL" está seleccionada, no procesar la tabla y salir del bucle
    // (Puedes agregar aquí cualquier lógica adicional que necesites para el caso "FORMA MANUAL")
  } else {
    // Tamaño de letra reducido para el contenido de la tabla
    const fontSizeTabla = 5;

    // Obtener la tabla por su ID
    const table = document.querySelector("#output table");

    // Obtener las filas de la tabla
    const rows = table.getElementsByTagName("tr");

    // Posición inicial de la tabla en el PDF
    let xPos = 12;
    let yPost = 120;

    // Número máximo de columnas que deseas mostrar (en este caso, 12 columnas)
    const maxColumnsToShow = 12;

    // Recorrer las filas de la tabla y agregarlas al PDF (incluyendo la fila 0)
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");

      // Procesar la fila 0 (encabezado) con celdas <th>
      if (i === 0) {
        const headerCells = rows[i].getElementsByTagName("th");
        for (
          let j = 0;
          j < Math.min(headerCells.length, maxColumnsToShow);
          j++
        ) {
          const cellContent = headerCells[j].innerText;
          doc.text(xPos, yPost, cellContent);
          xPos += 13;
          if (j === maxColumnsToShow - 1) {
            xPos = 12;
            yPost += 4;
          }
        }
      } else {
        // Procesar las demás filas (que no son el encabezado)
        for (let j = 0; j < Math.min(cells.length, maxColumnsToShow); j++) {
          const cellContent =
            cells[j].querySelector("input")?.value || cells[j].innerText;
          doc.text(xPos, yPost, cellContent);
          xPos += 13;
          if (j === maxColumnsToShow - 1) {
            xPos = 12;
            yPost += 4;
          }
        }
      }
    }
  }

  // Save the PDF
  doc.save("remito.pdf");
}
