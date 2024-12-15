import TruckCompany from './truckCompaniesModel.js';

export const truckCompanyRegister = async (req, res) => {
    const { idType, idNumber, companyName, contactPerson, contactPhone, contactEmail, address, createdBy } = req.body;
    
    try {
        const existingTruckCompany = await TruckCompany.findOne({ idNumber });
        if (existingTruckCompany) {
            return res.status(409).json({ message: "The carrier is already registered." });
        }

        const truckCompany = new TruckCompany({ idType, idNumber, companyName, contactPerson, contactPhone, contactEmail, address, createdBy });
        
        await truckCompany.save();

        res.status(201).json({ message: "Carrier successfully registered.", truckCompany });
    } catch (error) {
        res.status(500).json({ message: "Error registering carrier.", error: error.message });
    }
};

export const truckCompaniesList = async (req, res) => {
    try {
        const truckCompanies = await TruckCompany.find({});
        res.status(200).json(truckCompanies);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving carrier list.", error: error.message });
    }
};
