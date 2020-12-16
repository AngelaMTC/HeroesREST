const heroes = require("../controller/heroes.controller.js");
var router = require("express").Router();

// GET Methods

// GET All
router.get("/heroes", heroes.findAll);

// GET by ID
router.get("/heroe/:id", heroes.findOne);

// // GET by Term
router.get("/heroesTerm", heroes.findSome);

// // GET Active
router.get("/heroesAct", heroes.findActive);

// GET Agrupación(aggregate):
router.get('/heroesGroup', heroes.grouping);

//PAGINATION:
router.get('/pageH', heroes.pagination)

// POST Heroe
// router.post("/heroe",heroes.create);

/** POST Insertar Heroe:**/
router.post('/InsH', heroes.insertarHeroe);

/**POST Actualizar Heroe**/ 
// router.post('/ActH', heroes.actualizarHeroe);

/**DELETE Eliminar Heroe**/ 
// router.post('/EliH', heroes.eliminarHeroe);

// DELETE Heroe:
router.delete("/hero/:id", heroes.delete);

// PUT Heroe:
router.put('/heroe/:id', heroes.update);

module.exports = router;
