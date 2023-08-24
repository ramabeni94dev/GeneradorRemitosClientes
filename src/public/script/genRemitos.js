//--------------------GENERACION MANUAL-------------------------------------------------------
const piezas = []; // Array para almacenar las piezas ingresadas

// Función para agregar una pieza a la lista
const agregarPieza = () => {
  const cantidadInput = document.getElementById("cantidad");
  const descripcionInput = document.getElementById("descripcion");
  const cantidad = cantidadInput.value;
  const descripcion = descripcionInput.value;

  if (cantidad && descripcion) {
    piezas.push({ cantidad, descripcion });
    actualizarListaPiezas();
    cantidadInput.value = "";
    descripcionInput.value = "";
  }
};

// Función para actualizar la lista de piezas en el HTML
const actualizarListaPiezas = () => {
  const listaPiezas = document.getElementById("listaPiezas");
  listaPiezas.innerHTML = "";

  piezas.forEach((pieza, index) => {
    const listItem = document.createElement("li");

    // Crear elementos <p> con ids únicos para cada pieza
    const indexElement = document.createElement("p");
    indexElement.textContent = `Pieza ${index + 1}:`;
    indexElement.id = `piezaIndex${index + 1}`;

    const cantidadElement = document.createElement("p");
    cantidadElement.textContent = `Cantidad: ${pieza.cantidad} unidades`;
    cantidadElement.id = `piezaCantidad${index + 1}`;

    const descripcionElement = document.createElement("p");
    descripcionElement.textContent = `Descripción: ${pieza.descripcion}`;
    descripcionElement.id = `piezaDescripcion${index + 1}`;

    // Agregar los elementos <p> al <li>
    listItem.appendChild(indexElement);
    listItem.appendChild(cantidadElement);
    listItem.appendChild(descripcionElement);

    listaPiezas.appendChild(listItem);
  });
};

// Función para generar el remito con las piezas ingresadas
const generarRemito = () => {
  if (piezas.length > 0) {
    const remito = `Remito generado con las siguientes piezas: \n\n`;
    const listaPiezasTexto = piezas
      .map(
        (pieza, index) =>
          `Pieza ${index + 1}: ${pieza.cantidad} unidades de ${
            pieza.descripcion
          }`
      )
      .join("\n");
    const remitoCompleto = remito + listaPiezasTexto;
    alert(remitoCompleto);
    piezas.length = 0; // Limpiar la lista de piezas después de generar el remito
    actualizarListaPiezas();
  } else {
    alert("Agrega piezas antes de generar el remito.");
  }
};

//--------------------GENERACION POR LISTADO DE MATERIALES---------------------------------------
function readExcelFile() {
  const inputFile = document.getElementById("inputFile");
  const outputDiv = document.getElementById("output");

  // Validar si se seleccionó un archivo
  if (!inputFile.files || !inputFile.files[0]) {
    Swal.fire({
      icon: "info",
      title: "Archivo no seleccionado",
      text: "Por favor, seleccione un archivo Excel.",
    });

    return;
  }

  const file = inputFile.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Supongamos que queremos obtener los datos de la primera hoja (Sheet 1)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Verificar si el archivo contiene el texto "LISTA DE MATERIALES" en alguna parte
    let found = false;
    const sheetCells = Object.values(sheet);
    for (const cell of sheetCells) {
      if (cell.t === "s" && cell.v.includes("LISTA DE MATERIALES")) {
        found = true;
        break;
      }
    }

    if (!found) {
      Swal.fire({
        icon: "warning",
        title: "Archivo incorrecto",
        text: "El archivo Excel seleccionado no contiene la lista de materiales.",
      });
      return;
    }

    // Utilizamos la función XLSX.utils.sheet_to_json para obtener los datos como un array de objetos JSON
    const jsonDataArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Filtrar solo los objetos que tienen la propiedad "Item" a partir de la fila 11
    const filteredData = jsonDataArray
      .slice(9)
      .filter((row) => row[0] !== undefined);

    // Crear un array de objetos JSON con los campos deseados, incluyendo "Item"
    const jsonData = filteredData.map((row) => ({
      Item: row[0],
      Cantidad: row[6],
      OT: row[7],
      Conj: row[8],
      Iden: row[9],
      Pos: row[10],
      Material: row[1],
      Espesor: row[2],
      Largo: row[3],
      Plano: row[4],
      Ancho: row[5],
      Observacion: row[11],
    }));

    // Mostrar los datos en el HTML como tabla
    const table = document.createElement("table");
    const headerRow = table.insertRow();
    for (const prop in jsonData[0]) {
      const th = document.createElement("th");
      th.textContent = prop;
      headerRow.appendChild(th);
    }

    jsonData.forEach((item) => {
      const row = table.insertRow();
      for (const prop in item) {
        const cell = row.insertCell();
        if (prop === "Cantidad") {
          const input = document.createElement("input");
          input.type = "number";
          input.value = item[prop];
          input.addEventListener("change", (event) => {
            item[prop] = event.target.value;
          });
          cell.appendChild(input);
        } else {
          cell.textContent = item[prop];
        }
      }

      const deleteButtonCell = row.insertCell();
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.addEventListener("click", () => {
        const index = jsonData.indexOf(item);
        jsonData.splice(index, 1);
        table.deleteRow(row.rowIndex);
      });
      deleteButtonCell.appendChild(deleteButton);
    });

    outputDiv.innerHTML = "";
    outputDiv.appendChild(table);
  };

  reader.readAsArrayBuffer(file);
}
