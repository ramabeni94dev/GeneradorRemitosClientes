// indexRoutes.js
import { Router } from "express";
import fs from "fs";

const router = Router();

const rutaClientesJson = "./src/public/script/Clientes.json";

// Ruta para guardar el objeto JSON en el archivo
router.post("/guardarCliente", (req, res) => {
  try {
    const nuevoCliente = req.body;

    fs.readFile(rutaClientesJson, "utf8", (err, data) => {
      if (err) {
        // Si el archivo no existe, lo creamos con un array vacío
        if (err.code === "ENOENT") {
          fs.writeFile(rutaClientesJson, "[]", (err) => {
            if (err) {
              res
                .status(500)
                .json({ error: "Error al crear el archivo de clientes." });
            } else {
              guardarClienteEnArchivo(nuevoCliente, res);
            }
          });
        } else {
          res
            .status(500)
            .json({ error: "Error al leer el archivo de clientes." });
        }
      } else {
        guardarClienteEnArchivo(nuevoCliente, res, data);
      }
    });
  } catch (error) {
    console.error("Error al guardar el cliente:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Función para guardar el cliente en el archivo
function guardarClienteEnArchivo(nuevoCliente, res, data = "[]") {
  const clientes = JSON.parse(data);
  clientes.push(nuevoCliente);
  fs.writeFile(rutaClientesJson, JSON.stringify(clientes, null, 2), (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al escribir en el archivo de clientes." });
    } else {
      res.json({ success: "Cliente agregado correctamente." });
    }
  });
}

const rutaEntregasJson = "./src/public/script/entregas.json";

// Ruta para guardar el objeto JSON en el archivo
router.post("/guardarEntrega", (req, res) => {
  try {
    const nuevoObjetoFinal = req.body;

    fs.readFile(rutaEntregasJson, "utf8", (err, data) => {
      if (err) {
        // Si el archivo no existe, lo creamos con un array vacío
        if (err.code === "ENOENT") {
          fs.writeFile(rutaEntregasJson, "[]", (err) => {
            if (err) {
              res
                .status(500)
                .json({ error: "Error al crear el archivo de entregas." });
            } else {
              guardarObjetoFinalEnArchivo(nuevoObjetoFinal, res);
            }
          });
        } else {
          res
            .status(500)
            .json({ error: "Error al leer el archivo de entregas." });
        }
      } else {
        guardarObjetoFinalEnArchivo(nuevoObjetoFinal, res, data);
      }
    });
  } catch (error) {
    console.error("Error al guardar el objeto final:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Función para guardar el objeto final en el archivo
function guardarObjetoFinalEnArchivo(nuevoObjetoFinal, res, data = "[]") {
  const objetosFinales = JSON.parse(data);
  objetosFinales.push(nuevoObjetoFinal);
  fs.writeFile(
    rutaEntregasJson,
    JSON.stringify(objetosFinales, null, 2),
    (err) => {
      if (err) {
        res
          .status(500)
          .json({ error: "Error al escribir en el archivo de entregas." });
      } else {
        res.json({ message: "Remito Generado y Guardado." });
      }
    }
  );
}

// Definir las rutas sin protección
router.get("/", (req, res) => {
  res.render("login", { title: "login" });
});

// Definir el middleware de autenticación
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Si el usuario está autenticado, continuar con la solicitud
    return next();
  }
  // Si el usuario no está autenticado, redireccionar a la página de inicio de sesión
  res.redirect("/");
};

// Rutas protegidas con el middleware de autenticación
router.get("/index", ensureAuthenticated, (req, res) => {
  res.render("index", { title: "Agregar cliente", user: req.user }); // Pasar el objeto del usuario a la vista
});

router.get("/buscador", ensureAuthenticated, (req, res) => {
  res.render("buscador", { title: "Buscador de entregas", user: req.user }); // Pasar el objeto del usuario a la vista
});

router.get("/remitos", ensureAuthenticated, (req, res) => {
  res.render("remitos", { title: "Generador de remitos", user: req.user }); // Pasar el objeto del usuario a la vista
});

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.redirect("/"); // Redireccionar a la página de inicio de sesión después del cierre de sesión
  });
});

export default router;
