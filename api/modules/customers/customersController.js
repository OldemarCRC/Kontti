import Customer from './customersModel.js';

export const customerRegister = async (req, res) => {
    const { idType, idNumber, customerName, customerAddress, customerContact, customerEmail, customerPhoneNumber, createdBy } = req.body;
    
    try {
        const existingCustomer = await Customer.findOne({ idNumber });
        if (existingCustomer) {
            return res.status(409).json({ message: "The client is already registered." });
        }

        const customer = new Customer({ idType, idNumber, customerName, customerAddress, customerContact, customerEmail, customerPhoneNumber, createdBy });
        
        await customer.save();

        res.status(201).json({ message: "Client successfully registered.", customer });
    } catch (error) {
        res.status(500).json({ message: "Error registering client.", error: error.message });
    }
};

export const customersList = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching client list.", error: error.message });
    }
};
