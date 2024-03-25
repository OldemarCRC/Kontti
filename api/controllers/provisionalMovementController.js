import ProvisionalMovement from "../models/provisionalMovementModel.js";


//Permite que carguemos a la base de datos un archivo de excel con muchos contenedores.
export const createProvisionalMovement = async (req, res) => {
  try {
    // Verifica si el cuerpo de la solicitud es un array
    if (Array.isArray(req.body)) {
      // Inserta múltiples documentos
      const provisionalMovements = await ProvisionalMovement.insertMany(req.body);
      res.status(201).json(provisionalMovements);
    } else {
      // Inserta un solo documento
      const newProvisionalMovement = new ProvisionalMovement(req.body);
      await newProvisionalMovement.save();
      res.status(201).json(newProvisionalMovement);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateProvisionalMovement = async (req, res, next) => {
  try {
    const updatedProvisionalMovement = await ProvisionalMovement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProvisionalMovement);
  } catch (err) {
    next(err);
  }
};

export const deleteProvisionalMovement = async (req, res, next) => {
  try {
    await ProvisionalMovement.findByIdAndDelete(req.params.id);
    res.status(200).json("ProvisionalMovement has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getProvisionalMovement = async (req, res, next) => {
  try {
    const provisionalMovement = await Movement.findById(req.params.id);
    res.status(200).json(provisionalMovement);
  } catch (err) {
    next(err);
  }
};

export const getProvisionalMovements = async (req, res, next) => {
 Object.keys(req.query).forEach((key) => {
   if (req.query[key] === "") {
     delete req.query[key];
   }
 });

 console.log(req.query)

};
