/////////////CONTROLLER////////////
const db = require("../model/heroes.model.js");
const Heroe = db.heroes;

//CREATE OPERATION
exports.create = (req, res) => {
  // Validación de petición:
  if (!req.body) {
    req.status(400).send({ message: "El contenido no puede estar vacío." });
    return;
  }

  var aux = 0;
  Heroe.findOne().sort({_id: -1}).then( data => { 
    var aux = parseInt(data._id) + 1;
    // Crear Heroe:
  const heroe = new Heroe({
    _id: aux,
    nombre: req.body.nombre,
    bio: req.body.bio,
    img: req.body.img,
    aparicion: req.body.aparicion,
    casa: req.body.casa,
    activo: true
  });

  heroe.save()
    .then((data) => {
      res.send({ msg: "Usuario agregado correctamente" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Ocurrió un error." });
    });
});
};
  



  // READ OPERATIONS:
  exports.findAll = (req, res) => {
    Heroe.find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        throwError(res, err);
      });
  };

  exports.findOne = (req, res) => {
    const id = req.params.id;

    Heroe.findById(id)
      .then((data) => {
        if (!data)
          res
            .status(500)
            .send({ message: `No se encontró elemento con id: ${id}.` });
        else res.send(data);
      })
      .catch((err) => {
        throwError(res, err);
      });
  };

  exports.findSome = (req, res) => {
    const termino = req.query.termino;
    console.log(termino);
    var query = termino
      ? {
          nombre: {
            $regex: new RegExp(termino), //Que lo que tengan nombre y termino sean parecidos
            $options: "i",
          },
          estado: "activo",
        }
      : {};
    Heroe.find(query)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        throwError(res, err);
      });
  };

  exports.findActive = (req, res) => {
    Heroe.find({ activo: true })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        throwError(res, err);
      });
  };

  // UPDATE Operations:
  exports.update = (req, res) => {
    if (!req.body){
    return res.status(400).send({
      msg:'La petición no puede ser vacía.'
    });
  }
  const id = parseInt(req.params.id);
  Heroe.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
  .then(data => {
    if (!data) {
      res.status(404).send({
        msg: `No se pudo actualizas Heroe con id: ${id}`
      });
    } 
    else res.send({
      msg: 'Heroe actualizado exitosamente.'
    });
  })
  .catch(err => {
    throwError(res,err);
  })
};

  // DELETE Operations:
  exports.delete = (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);

    Heroe.findByIdAndUpdate(id, { activo: false }, {
    useFindAndModify: true})
    .then(data => {
      if (!data)
      res.status(404).send({
        msg: `El usuario no se pudo actualizar con el id: ${id}`
      });
      else res.send({
        msg: 'Heroe se ha removido exitosamente.'
      });
    })
      .catch(err  => {
        throwError(res,err);
      });
    };

  // AGGREGATE
  exports.grouping = (req, res) => {
    Heroe.aggregate([{ 
      $lookup: {
        from: "Casas",
        localField: "casa",
        foreignField: "casa",
        as: "casas"
      }
    },
      { $unwind: "$casas" },
      // { $match: { casa: 'DC' } },      
      // { $project: {_id: 0, nombre: 1, "casas.casa":1, "casas.fundacion": 1} }
      { $group: {
          _id: "$casas.casa",
          count: { $sum: 1 }
      }
    }
    ])
    .then(grupo => {
        res.send(grupo);
    })
    .catch(err => {
      throwError(res, err);
    });

  }

  // PAGINATION
  exports.pagination = async(req, res) => {
    const { page = 1, limit = 3 } = req.query;
    try {
      // Ejecutar query con número de página y el limite de documentos
      const heroes = await Heroe.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      console.log(heroes);

      // Obtener el total de documentos en la colección
      const total = await Heroe.countDocuments();

      // Enviar respuesta
      res.json({
        heroes,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (err) {
      throwError(res, err);
    }
  }

  // Utilería:
  function throwError(res, err) {
    res.status(500).send({
      message: err.message || "Ocurrió un error con el web server.",
    });
  
  }
