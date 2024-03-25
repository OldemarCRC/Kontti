import Inventory from "../models/inventoryModel.js";


//Permite que carguemos a la base de datos un archivo de excel con muchos contenedores.
export const createInventory = async (req, res) => {
  try {
    // Verifica si el cuerpo de la solicitud es un array
    if (Array.isArray(req.body)) {
      // Inserta múltiples documentos
      const inventory = await Inventory.insertMany(req.body);
      res.status(201).json(inventory);
    } else {
      // Inserta un solo documento
      const newInventory = new Inventory(req.body);
      await newInventory.save();
      res.status(201).json(newInventory);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//******************************GET INVENTORY********************************/

/* export async function getInventory(req, res) {
  console.log("Fetching inventory...");
  try {
    console.log("Before querying the database");
    const inventory = await Inventory.aggregate([
      // Etapa 1: Filtrar por ingresos
      { $match: { gateInOrGateOut: "IN" } },
      
      // Etapa 2: Agrupar por número de contenedor
      {
        $group: {
          _id: "$containerNumber",
          lastIn: { $max: "$dateAndTime" },
        },
      },
      
      // Etapa 3: Buscar por registros de salida después del último ingreso
      {
        $lookup: {
          from: "inventory", // Asegúrate de que este sea el nombre correcto de tu colección
          let: { containerNumber: "$_id", lastIn: "$lastIn" },
          pipeline: [
            { $match:
              { $expr:
                { $and: [
                    { $eq: ["$containerNumber", "$$containerNumber"] },
                    { $eq: ["$gateInOrGateOut", "OUT"] },
                    { $gt: ["$dateAndTime", "$$lastIn"] }
                  ]
                }
              }
            },
          ],
          as: "outRecords"
        }
      },
      
      // Etapa 4: Filtrar contenedores sin registros de salida después del último ingreso
      { $match: { outRecords: { $size: 0 } } },
      
      // Etapa 5: Proyectar el resultado final
      {
        $project: {
          customer: 1,
          containerNumber: "$_id",
          lastIn: 1,
          customer:1,
          truckID:1,
          gateInOrGateOut:1,
        }
      }
    ]).exec();
    
    res.json(inventory);
    console.log(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).send(error);
  }
} */




//****************************** FIN DE GET INVENTORY********************************/

export const updateInventory = async (req, res, next) => {
  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedInventory);
  } catch (err) {
    next(err);
  }
};

export const deleteInventory = async (req, res, next) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json("Inventory has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    res.status(200).json(inventory);
  } catch (err) {
    next(err);
  }
};

export const getInventorys = async (req, res, next) => {
 Object.keys(req.query).forEach((key) => {
   if (req.query[key] === "") {
     delete req.query[key];
   }
 });

 console.log(req.query)

};

/* export const createContainer = async (req, res, next) => {
  const newContainer = new Container(req.body);

  try {
    const savedContainer = await newContainer.save();
    res.status(200).json(savedContainer);
  } catch (err) {
    next(err);
  }
}; */