// El código JavaScript previo permanece igual

// Función para mostrar u ocultar el formulario según la opción seleccionada
const toggleForms = () => {
  const modoSelect = document.getElementById("modo");
  const listaMaterialesForm = document.getElementById("listaMaterialesForm");
  const manualForm = document.getElementById("manualForm");

  if (modoSelect.value === "lista_materiales") {
    listaMaterialesForm.style.display = "block";
    manualForm.style.display = "none";
  } else if (modoSelect.value === "manual") {
    listaMaterialesForm.style.display = "none";
    manualForm.style.display = "block";
  } else {
    listaMaterialesForm.style.display = "none";
    manualForm.style.display = "none";
  }
};

// Agregar evento onchange al select
const modoSelect = document.getElementById("modo");
modoSelect.addEventListener("change", toggleForms);
toggleForms(); // Asegurarse de que ningún formulario esté visible al cargar la página
