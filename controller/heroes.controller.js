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
    estado: "activo"
  });

  heroe.save()
    .then((data) => {
      res.send(data);
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
    const id = parseInt(req.params.id);

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
    Heroe.find({ estado: "activo" })
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
  const id= req.params.id;
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

  // DELETE Operation:
  exports.delete = (req, res) => {
    const id = req.params.id;

    Heroe.findOneAndUpdate(id, {activo: false}, {
    useFindAndModify: false})
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
  
//GET(aggregate) para obtener datos:
// {project:} es para dejar de ver unos campos y otros no.
// {$match:} es la coincidencia.
exports.grouping = (req,res) => {
  // let grupo = 
  Heroe.aggregate([
    { $lookup: {from: 'Casas' ,localField: 'casa', foreignField: 'casa', as: 'casas'}},
    {$unwind: '$casas'},
    {$group: { _id: '$casas.casa', count: { $sum: 1 }} } // Sin el $, cuenta todo.
    // $match: { casa: 'DC' }},
    // {$project: { _id: 0, nombre: 1, casa: 1, 'casas.casa': 1} 
  ])
  .then(grupo => {
    res.send(grupo);
  })
  .catch(err => {
    throwError(res, err);
  });
}

/////////////////////////////////////////////////////////////////////////////////
/********(POST)INSERTAR*********/ 
exports.insertarHeroe =(req,res) => {
  let body = req.body;
  let Newheroe = new Heroe([
    {$lookup: {from: 'Heroes',
    _id: _id.body,
    nombre: nombre.body,
    bio: bio.body,
    img: img.body,
    aparicion: aparicion.body,
    casa: casa.body,
    activo: activo.body}}
  ])
  .catch(err => {
    throwError(res, err);
  });
}

/********(POST)ACTUALIZAR*********/ 
exports.actualizarHeroe = (req, res) => {
  if (!req.body){
  return res.status(400).send({
    msg:'La petición no puede ser vacía.'
  });
}
const id= req.params.id;
Heroe.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
.then(data => {
  if (!data) {
    res.status(404).send({
      msg: `No se pudo actualizar Heroe con id: ${id}`
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
/********(DELETE)ELIMINAR*********/ 
exports.eliminarHeroe =(req,res) => {
  Heroe.findByIdAndUpdate(id, {activo: false }, {new: true, runValidators: true, context: 'query'},
  (err, usrDB) =>{
    if (err){
            return res.status(400).json({
              ok: false,
              msg: 'Ocurrió un error al momento de eliminar.',
              err
            });
          }
          res.json({
            ok: true,
            msg: 'Herpe eliminado exitosamente.',
            usrDB 
          });
  });
}
////////////////////////////////////////////////////////////////////////////////////

  // Utilería:
  function throwError(res, err) {
    res.status(500).send({
      message: err.message || "Ocurrió un error con el web server.",
    });
  
}
