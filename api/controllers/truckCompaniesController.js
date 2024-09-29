import TruckCompany from '../models/truckCompaniesModel.js';

// Controlador para registrar un nuevo transportista
export const truckCompanyRegister = async (req, res) => {
    const { idType, idNumber, companyName, contactPerson, contactPhone, contactEmail, address, createdBy } = req.body;
    
    try {
        // Verificar si el transportista ya existe
        const existingTruckCompany = await TruckCompany.findOne({ idNumber });
        if (existingTruckCompany) {
            return res.status(409).json({ message: "El transportista ya está registrado." });
        }

        // Crear un nuevo transportista
        const truckCompany = new TruckCompany({ idType, idNumber, companyName, contactPerson, contactPhone, contactEmail, address, createdBy });
        
        // Guardar el transportista en la base de datos
        await truckCompany.save();

        res.status(201).json({ message: "Transportista registrado CON ÉXITO.", truckCompany });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el transportista.", error: error.message });
    }
};

// Controlador para listar todos los transportistas
export const truckCompaniesList = async (req, res) => {
    try {
        const truckCompanies = await TruckCompany.find({});
        res.status(200).json(truckCompanies);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la lista de transportistas.", error: error.message });
    }
};
