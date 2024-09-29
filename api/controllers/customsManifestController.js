import CustomsManifest from '../models/customsManifestModel.js';

// Controlador para registrar nuevo manifiesto
export const customsManifestRegister = async (req, res) => {
    const { customsNumber, officialArrivalDate, transportMode, customsManifestType, customsLocationCode, createdBy } = req.body;

    try {
        // Verificar si el manifiesto ya existe
        const existingCustomsManifest = await CustomsManifest.findOne({ customsNumber });
        if (existingCustomsManifest) {
            return res.status(409).json({ message: "El manifiesto ya está registrado." });
        }

        // Crear un nuevo manifiesto
        const newCustomsManifest = new CustomsManifest({ customsNumber, officialArrivalDate, transportMode, customsManifestType, customsLocationCode, createdBy });
        
        // Guardar el manifiesto en la base de datos
        await newCustomsManifest.save();

        res.status(201).json({ message: "Manifiesto registrado CON ÉXITO.", customsManifest: newCustomsManifest });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el manifiesto.", error: error.message });
    }
};

// Controlador para listar todos los manifiestos
export const customsManifestList = async (req, res) => {
    try {
        const customManifests = await CustomsManifest.find({});
        res.status(200).json(customManifests);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la lista de manifiestos.", error: error.message });
    }
};