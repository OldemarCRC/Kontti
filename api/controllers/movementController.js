import Movement from "../models/movementModel.js";


//Permite que carguemos a la base de datos un archivo de excel con muchos contenedores.
export const createMovement = async (req, res) => {
  try {
    // Verifica si el cuerpo de la solicitud es un array
    if (Array.isArray(req.body)) {
      // Inserta múltiples documentos
      const movements = await Movement.insertMany(req.body);
      res.status(201).json(movements);
    } else {
      // Inserta un solo documento
      const newMovement = new Movement(req.body);
      await newMovement.save();
      res.status(201).json(newMovement);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateMovement = async (req, res, next) => {
  try {
    const updatedMovement = await Movement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedMovement);
  } catch (err) {
    next(err);
  }
};

export const deleteMovement = async (req, res, next) => {
  try {
    await Movement.findByIdAndDelete(req.params.id);
    res.status(200).json("Movement has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getMovement = async (req, res, next) => {
  try {
    const movement = await Movement.findById(req.params.id);
    res.status(200).json(movement);
  } catch (err) {
    next(err);
  }
};

export const getMovements = async (req, res, next) => {
 Object.keys(req.query).forEach((key) => {
   if (req.query[key] === "") {
     delete req.query[key];
   }
 });

 console.log(req.query)

};
