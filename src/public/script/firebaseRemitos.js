import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Define the app variable
let app;
// Define the clientesCollection and db variables
let RemitosCollection;
let db;

// Fetch the Firebase configuration from the server
fetch("/firebase-config")
  .then((response) => response.json())
  .then((firebaseConfig) => {
    // Initialize the Firebase app
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");

    // Initialize db and RemitosCollection after the app is initialized
    db = getFirestore(app);
    RemitosCollection = collection(db, "Remitos");
  })
  .catch((error) => {
    console.error("Error fetching Firebase configuration:", error);
  });

// Array para almacenar todos los objetos finales generados
const objetosFinalesArray = [];

// ---------------------CREACION OBJETO TOTAL REMITO---------------------

// Función para generar el objeto a partir del contenido de "clienteDetails"
function generarObjetoCliente() {
  const clienteDetailsElement = document.getElementById("clienteDetails");
  if (!clienteDetailsElement) {
    console.error("Elemento 'clienteDetails' no encontrado.");
    return;
  }

  // -----------------------objeto cliente------------------

  // Crear un array con los IDs de los elementos <a>
  const anchorIds = [
    "razon-social",
    "direccion",
    "localidad",
    "provincia",
    "zona",
    "codigo-postal",
    "cuit",
    "zona",
  ];

  // Crear un objeto para almacenar las propiedades del cliente
  const objetoCliente = {};

  // Recorrer cada ID y extraer el valor correspondiente del elemento <a>
  for (const anchorId of anchorIds) {
    // Obtener el elemento <a> utilizando el anchorId
    const anchorElement = document.getElementById(anchorId);

    // Verificar si el elemento <a> con el ID dado existe
    if (!anchorElement) {
      console.error(`Elemento '${anchorId}' no encontrado.`);
      Swal.fire({
        icon: "error",
        title: "Elemento no encontrado",
        text: `El elemento '${anchorId}' no fue encontrado. La función se cancelará.`,
      });

      return; // Cancelar la función en caso de que no se encuentre el elemento
    }

    // Obtener el contenido del elemento <a>
    const contenidoAnchor = anchorElement.innerText;

    // Eliminar espacios en blanco adicionales al inicio y al final del valor
    const valorLimpio = contenidoAnchor.trim();

    // Agregar la propiedad al objeto objetoCliente
    objetoCliente[anchorId] = valorLimpio;
  }

  // -----------------------objeto LISTA PIEZAS MANUAL------------------

  // Generemos el objeto para "listaPiezas"
  const listaPiezasElement = document.getElementById("listaPiezas");
  if (!listaPiezasElement) {
    console.error("Elemento 'listaPiezas' no encontrado.");
    return;
  }

  // Obtener los elementos <li> dentro del elemento "listaPiezas"
  const listaPiezasItems = listaPiezasElement.getElementsByTagName("li");

  // Crear un array para almacenar cada objeto de pieza
  const piezasArray = [];

  // Recorrer cada elemento <li> y convertirlo en un objeto de pieza
  for (let i = 0; i < listaPiezasItems.length; i++) {
    // Obtener el contenido de los elementos <p> dentro del elemento <li>
    const piezaIndexElement = listaPiezasItems[i].querySelector(
      `#piezaIndex${i + 1}`
    );
    const piezaCantidadElement = listaPiezasItems[i].querySelector(
      `#piezaCantidad${i + 1}`
    );
    const piezaDescripcionElement = listaPiezasItems[i].querySelector(
      `#piezaDescripcion${i + 1}`
    );

    // Verificar si los elementos existen antes de continuar
    if (
      !piezaIndexElement ||
      !piezaCantidadElement ||
      !piezaDescripcionElement
    ) {
      console.error(
        `Elementos de pieza no encontrados en el item <li> número ${i + 1}.`
      );
      continue;
    }

    // Obtener el nombre de la pieza (contenido del elemento <p> con ID "piezaIndexX")
    const nombrePieza = piezaIndexElement.innerText;

    // Extraer la cantidad de unidades (contenido del elemento <p> con ID "piezaCantidadX")
    const cantidadUnidades = piezaCantidadElement.innerText.split(": ")[1];

    // Extraer la descripción (contenido del elemento <p> con ID "piezaDescripcionX")
    const descripcionPieza = piezaDescripcionElement.innerText.split(": ")[1];

    // Crear un objeto de pieza con las propiedades "nombre", "cantidad" y "descripcion"
    const objetoPieza = {
      nombre: nombrePieza,
      cantidad: parseInt(cantidadUnidades), // Convertir la cantidad a un número entero
      descripcion: descripcionPieza,
    };

    // Agregar el objeto de pieza al array
    piezasArray.push(objetoPieza);
  }

  //-----------------------objeto LISTA PIEZAS LISTA DE MATERIALES------------------

  const tablaElement = document.getElementById("output");
  if (!tablaElement) {
    console.error("Elemento 'output' (tabla) no encontrado.");
    return;
  }

  // Obtener todas las filas <tr> dentro del elemento tabla
  const filas = tablaElement.getElementsByTagName("tr");

  // Crear un array para almacenar cada objeto de fila
  const filasArray = [];

  // Empezar el loop en 1 para saltar la fila de encabezados <th>
  for (let i = 1; i < filas.length; i++) {
    const fila = filas[i];
    // Obtener los inputs dentro de la fila
    const inputs = fila.getElementsByTagName("input");
    const numeroItem = parseInt(fila.getElementsByTagName("td")[0].innerText);

    // Verificar si los elementos existen antes de continuar
    if (inputs.length !== 1) {
      console.error(
        `El número de inputs en la fila ${i + 1} no es el esperado.`
      );
      continue;
    }

    // Obtener el valor del input
    const cantidad = parseInt(inputs[0].value);

    // Obtener los valores de OT, Conj e Iden
    const OT = fila.getElementsByTagName("td")[2].innerText;
    const Conj = fila.getElementsByTagName("td")[3].innerText;
    const Iden = fila.getElementsByTagName("td")[4].innerText;

    // Crear la propiedad "CodigoPieza" con la concatenación de OT, Conj e Iden
    const CodigoPieza = `${OT}.${Conj}.${Iden}`;

    // Crear un objeto de fila con las propiedades "Item" y "Cantidad"
    const objetoFila = {
      CodigoPieza: CodigoPieza,
      Item: numeroItem,
      Cantidad: cantidad,
      OT: fila.getElementsByTagName("td")[2].innerText,
      Conj: fila.getElementsByTagName("td")[3].innerText,
      Iden: fila.getElementsByTagName("td")[4].innerText,
      Pos: fila.getElementsByTagName("td")[5].innerText,
      Material: fila.getElementsByTagName("td")[6].innerText,
      Espesor: fila.getElementsByTagName("td")[7].innerText,
      Largo: fila.getElementsByTagName("td")[8].innerText,
      Plano: fila.getElementsByTagName("td")[9].innerText,
      Ancho: fila.getElementsByTagName("td")[10].innerText,
      Observacion: fila.getElementsByTagName("td")[11].innerText,
    };

    // Agregar el objeto de fila al array
    filasArray.push(objetoFila);
  }

  // --------------------------OBJETO referencia---------------------------
  const referenciaElement = document.querySelector(".referencia");

  // Verificar si el elemento "referencia" fue encontrado
  if (!referenciaElement) {
    console.error("Elemento 'referencia' no encontrado.");
    Swal.fire({
      icon: "error",
      title: "Elemento no encontrado",
      text: "El elemento 'referencia' no fue encontrado. La función se cancelará.",
    });

    return; // Cancelar la función en caso de que el elemento no sea encontrado
  }

  const selectElement = referenciaElement.querySelector("#Modo");
  const modoSeleccionado = selectElement.value;

  // Verificar si se ha seleccionado una de las opciones válidas ("OS", "OT" o "PIR")
  if (!modoSeleccionado || !["OS", "OT", "PIR"].includes(modoSeleccionado)) {
    console.error(
      "No se ha seleccionado una opción válida en el elemento 'Modo'."
    );
    Swal.fire({
      icon: "error",
      title: "Opción no válida",
      text: "Por favor, seleccione una de las opciones válidas ('OS', 'OT' o 'PIR'). La función se cancelará.",
    });

    return; // Cancelar la función si no se ha seleccionado una opción válida
  }

  const inputElement = referenciaElement.querySelector("#numRef");
  const valorNumerico = inputElement.value;

  // Verificar si el valor del <input> es vacío
  if (!valorNumerico.trim()) {
    console.error("El valor del elemento 'numRef' está vacío.");
    Swal.fire({
      icon: "error",
      title: "Valor vacío",
      text: "El valor del elemento 'numRef' está vacío. La función se cancelará.",
    });
    return; // Cancelar la función si el valor del input es vacío
  }

  // Crear un nuevo objeto que contenga los valores obtenidos
  const objetoReferencia = {
    modo: modoSeleccionado,
    numRef: valorNumerico,
  };

  // --------------------------OBJETO user---------------------------
  // Obtener el elemento <p> con la clase "user"
  const userElement = document.querySelector(".user");

  // Obtener el contenido del elemento <p> (texto "Rama" en este caso)
  const userName = userElement.innerText;

  // Crear el objeto "user" con la propiedad "name" que contiene el nombre del usuario
  const user = {
    name: userName,
  };

  // --------------------------OBJETO codigo---------------------------

  // Obtener el contenido del elemento "codigo"
  const codigoElement = document.getElementById("codigo");
  if (!codigoElement) {
    console.error("Elemento 'codigo' no encontrado.");
    return;
  }

  const codigoContent = codigoElement.innerText;

  // --------------------------OBJETO FINAL---------------------------

  // Obtener el contenido del elemento "dateTime"
  const dateTimeElement = document.getElementById("dateTime");
  if (!dateTimeElement) {
    console.error("Elemento 'dateTime' no encontrado.");
    return;
  }

  const dateTimeContent = dateTimeElement.innerText;

  // Crear el objeto para "objetoDateTime" que contiene las otras estructuras
  const objetoDateTime = {
    objetoReferencia,
    filasArray,
    piezasArray,
    objetoCliente,
    "Date Time": dateTimeContent,
    codigoData: codigoContent,
    user,
  };

  // Obtener el nombre de la razón social del elemento HTML
  const razonSocialElement = document.getElementById("razon-social");
  if (!razonSocialElement) {
    console.error("Elemento 'razon-social' no encontrado.");
    return;
  }

  // Obtener el contenido del elemento "razon-social" (nombre de la razón social)
  const razonSocial = razonSocialElement.innerText;

  // Crear el objeto final con la razón social como nombre y "objetoDateTime" como contenido
  const objetoFinal = {
    [dateTimeContent]: objetoDateTime,
  };

  // Agregar el objeto final al array
  objetosFinalesArray.push(objetoFinal);

  // // Verificar el array de filas generado en la consola
  // console.log("Lista de materiales:", filasArray);

  // // Verificar el array de piezas generado en la consola
  // console.log("Array de Piezas:", piezasArray);

  // // Verificar el objeto generado en la consola
  // console.log("Objeto Date Time:", objetoDateTime);

  // // Verificar el objeto generado en la consola
  // console.log("Datos cliente:", objetoCliente);

  // // Verificar el objeto generado en la consola
  // console.log("Objeto Final:", objetoFinal);

  if (filasArray.length > 0 || piezasArray.length > 0) {
    const url = "/guardarEntrega"; // Ruta relativa a la ubicación actual

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objetoFinal),
    })
      .then((response) => response.json())
      .then((data) => {
        // Puedes mostrar una alerta o realizar alguna acción con la respuesta del servidor
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: data.message, // Deberías ajustar esto según la respuesta del servidor
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al guardar el objeto final en el servidor.",
        });
        console.error(error);
      });

    /// Agregar el objeto a la colección "Remitos" en Firestore con la razón social como el ID del documento
    try {
      const remitosCollection = collection(db, "Remitos");

      // Obtener una referencia al documento con el ID de "razonSocial"
      const documentoRemito = doc(remitosCollection, razonSocial);

      // Obtener una referencia a la subcolección "entregas" dentro del documento de "razonSocial"
      const entregasRef = collection(documentoRemito, "entregas");

      // Agregar el objetoDateTime a la subcolección "entregas" utilizando su "Date Time" como ID del documento
      const fechaHora = objetoDateTime["Date Time"];
      const documentoFechaHora = doc(entregasRef, fechaHora);

      setDoc(documentoFechaHora, objetoDateTime)
        .then(() => {
          console.log(
            "Objeto agregado a la subcolección 'entregas' en Firestore con el nombre de 'Date Time' como ID."
          );
        })
        .catch((error) => {
          console.error(
            "Error al agregar el objeto a la subcolección 'entregas':",
            error
          );
        });
    } catch (error) {
      console.error(
        "Error al acceder a la colección 'Remitos' en Firestore:",
        error
      );
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Advertencia",
      text: "Hay que cargar piezas para generar el remito.",
    });
  }
}

// Llamar a la función para generar y ver el objeto cuando sea necesario
// Por ejemplo, cuando el usuario hace clic en un botón
document
  .getElementById("miBotonGenerarObjeto")
  .addEventListener("click", () => {
    generarObjetoCliente();
  });
