import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Define the app variable
let app;
// Define the clientesCollection and db variables
let clientesCollection;
let db;

// Fetch the Firebase configuration from the server
fetch("/firebase-config")
  .then((response) => response.json())
  .then((firebaseConfig) => {
    // Initialize the Firebase app
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");

    // Initialize db and clientesCollection after the app is initialized
    db = getFirestore(app);
    clientesCollection = collection(db, "Clientes");

    // Once the app is initialized, proceed with the rest of the code
    continueAppInitialization();
  })
  .catch((error) => {
    console.error("Error fetching Firebase configuration:", error);
  });

function continueAppInitialization() {
  // Obtener una referencia a la colección de clientes en Firestore

  // Obtén una referencia al botón
  const subirBtn = document.getElementById("subirBtn");

  // Add a click event listener to the button
  subirBtn.addEventListener("click", () => {
    // Call the `generarJSON` function to get the JSON object
    const objetoJSON = generarJSON();

    // Validate the input values before uploading
    if (validateInputs(objetoJSON)) {
      // Call the `subirAColeccionClientes` function passing the `objetoJSON` as an argument
      subirAColeccionClientes(objetoJSON);
    } else {
      Swal.fire({
        icon: "info",
        title: "Complete todos los valores",
        text: "Por favor, complete todos los campos antes de guardar en la base de datos.",
      });
    }
  });
}

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

  const objetoJSON = {
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
  };

  return objetoJSON;
}

function validateInputs(objetoJSON) {
  // Check if any required field is empty
  if (
    objetoJSON.RazonSocial === "" ||
    objetoJSON.NombreFantasia === "" ||
    objetoJSON.Cuit === "" ||
    objetoJSON.Direccion1_Fact === "" ||
    objetoJSON.Localidad_Fact === "" ||
    objetoJSON.CodPostal_Fact === "" ||
    objetoJSON.Provincia_id_Fact === "" ||
    objetoJSON.EMail === "" ||
    objetoJSON.Telefonos === "" ||
    objetoJSON.CondFisc_Id === ""
  ) {
    return false;
  }

  return true;
}

async function subirAColeccionClientes(objetoJSON) {
  const nombreObjeto = objetoJSON.RazonSocial;

  try {
    const documentoRef = doc(clientesCollection, nombreObjeto);
    await setDoc(documentoRef, objetoJSON);

    console.log("Documento agregado con ID:", nombreObjeto);

    // Show success message in the HTML document
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = "Documento agregado con éxito.";
  } catch (error) {
    console.error("Error al agregar el documento:", error);
  }
}

export { subirAColeccionClientes };
