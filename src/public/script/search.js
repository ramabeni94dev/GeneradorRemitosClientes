// Cargar el archivo JSON de manera asíncrona
fetch("/script/Clientes.json")
  .then((response) => response.json())
  .then((data) => {
    const clientesList = document.getElementById("clientesList");
    const clienteDetails = document.getElementById("clienteDetails");
    const searchInput = document.getElementById("searchInput");
    let recentClientes = [];
    let loaded = false; // Variable para verificar si la lista de clientes ha sido cargada

    // Función para generar la lista de clientes en el HTML
    const generateClientesList = (clientes) => {
      clientesList.innerHTML = "";
      clientes.slice(0, 5).forEach((cliente) => {
        const nombreCliente = Object.keys(cliente)[0]; // Obtiene el nombre del cliente
        const listItem = document.createElement("li");
        listItem.textContent = nombreCliente;
        listItem.addEventListener("click", () => showClienteDetails(cliente));
        clientesList.appendChild(listItem);
      });
    };

    // Función para mostrar los detalles del cliente seleccionado
    const showClienteDetails = (cliente) => {
      const nombreCliente = Object.keys(cliente)[0];
      const clienteSeleccionado = cliente[nombreCliente];

      const detallesClienteHTML =
        "<p>Razón Social: <a id='razon-social'>" +
        clienteSeleccionado.RazonSocial +
        "</a></p>" +
        "<p>Direccion: <a id='direccion'>" +
        clienteSeleccionado.Direccion1_Fact +
        "</a></p>" +
        "<p>Localidad: <a id='localidad'>" +
        clienteSeleccionado.Localidad_Fact +
        "</a></p>" +
        "<p>Provincia: <a id='provincia'>" +
        clienteSeleccionado.Provincia_id_Fact +
        "</a></p>" +
        "<p>Zona: <a id='zona'>" +
        clienteSeleccionado.DescripcionZona +
        "</a></p>" +
        "<p>Codigo Postal: <a id='codigo-postal'>" +
        clienteSeleccionado.CodPostal_Fact +
        "</a></p>" +
        "<p>Cuit: <a id='cuit'>" +
        clienteSeleccionado.Cuit +
        "</a></p>";

      clienteDetails.innerHTML = detallesClienteHTML;
    };

    // Función para filtrar los clientes por nombre
    const filterClientes = (query) => {
      if (query === "") {
        clientesList.innerHTML = ""; // Si el cuadro de búsqueda está vacío, limpiar la lista
        loaded = false; // Restaurar el estado para cargar la lista nuevamente
        return;
      }

      const filteredClientes = data.filter((cliente) => {
        const nombreCliente = Object.keys(cliente)[0];
        return nombreCliente.toLowerCase().includes(query.toLowerCase());
      });

      // Actualizar la lista de resultados con los últimos cinco clientes buscados recientemente
      generateClientesList(filteredClientes.slice(-5));
      loaded = true; // Marcar que la lista de clientes ha sido cargada
    };

    // Evento de escucha para el input de búsqueda
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value;

      if (!loaded) {
        // Cargar la lista de clientes solo cuando se ingresa texto en el cuadro de búsqueda
        filterClientes(query);
      } else {
        // Si ya se ha cargado la lista, solo actualizar los resultados con los clientes filtrados
        generateClientesList(
          data
            .filter((cliente) => {
              const nombreCliente = Object.keys(cliente)[0];
              return nombreCliente.toLowerCase().includes(query.toLowerCase());
            })
            .slice(-5)
        );
      }

      clienteDetails.innerHTML = ""; // Limpiar los detalles al escribir en el cuadro de búsqueda
    });
  })
  .catch((error) => {
    console.error("Error al cargar el archivo JSON:", error);
  });
