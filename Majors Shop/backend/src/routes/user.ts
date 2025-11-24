// routes/userRoutes.ts (MEJOR PRÁCTICA)
import { UserController } from "../controllers/userController.ts"; // Importamos la CLASE

import { Router } from "express";

/**
 * Función que recibe el controlador ya instanciado y devuelve el router.
 * @param userController La instancia de UserController.
 */
export function createUserRouter(userController: UserController): Router {
  const router = Router();

  // Ahora 'userController' es un parámetro conocido y tipado
  router.post("/register", (req, res) => userController.register(req, res));
  router.post("/login", (req, res) => userController.login(req, res));
  router.post("/logout", (req, res) => userController.logout(req, res));
  router.get("/", (req, res) => userController.getAllUsers(req, res));
  router.get("/:id", (req, res) => userController.getUserById(req, res));

  return router;
}
