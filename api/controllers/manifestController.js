import manifest from '../models/manifestModel.js';

export const manifestRegister = async (req, res) => {
    const { manifestNumber, officialArrivalDate, transportMode, manifestType, customsLocationCode, motorVessel, voyageNumber, createdBy } = req.body;

    try {
        const existingManifest = await Manifest.findOne({ manifestNumber });
        if (existingManifest) {
            return res.status(409).json({ message: "El manifiesto ya está registrado." });
        }

        const newManifest = new Manifest({ manifestNumber, officialArrivalDate, transportMode, manifestType, customsLocationCode, motorVessel, voyageNumber,createdBy });
        
        await newManifest.save();

        res.status(201).json({ message: "Manifiesto registrado CON ÉXITO.", manifest: newManifest });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el manifiesto.", error: error.message });
    }
};

// Controlador para listar todos los manifiestos
export const manifestList = async (req, res) => {
    try {
        const manifests = await manifest.find({});
        res.status(200).json(manifests);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la lista de manifiestos.", error: error.message });
    }
};