import Manifest from './manifestModel.js';

export const manifestRegister = async (req, res) => {
    const { manifestNumber, officialArrivalDate, transportMode, manifestType, customsLocationCode, motorVessel, voyageNumber, createdBy } = req.body;

    try {
        const existingManifest = await Manifest.findOne({ manifestNumber });
        if (existingManifest) {
            return res.status(409).json({ message: "The manifest is already registered." });
        }

        const newManifest = new Manifest({ manifestNumber, officialArrivalDate, transportMode, manifestType, customsLocationCode, motorVessel, voyageNumber, createdBy });
        
        await newManifest.save();

        res.status(201).json({ message: "Manifest successfully registered.", manifest: newManifest });
    } catch (error) {
        res.status(500).json({ message: "Error registering manifest.", error: error.message });
    }
};

export const manifestList = async (req, res) => {
    try {
        const manifests = await Manifest.find({});
        res.status(200).json(manifests);
    } catch (error) {
        res.status (500).json({ message: "Error retrieving manifest list.", error: error.message });
    }
};
