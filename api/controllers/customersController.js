import Customer from '../models/customersModel.js';

// Controlador para registrar un nuevo cliente
export const customerRegister = async (req, res) => {
    const { idType, idNumber, customerName, customerAddress, customerContact, customerEmail, customerPhoneNumber, createdBy } = req.body;
    
    try {
        // Verificar si el cliente ya existe
        const existingCustomer = await Customer.findOne({ idNumber });
        if (existingCustomer) {
            return res.status(409).json({ message: "El cliente ya está registrado." });
        }

        // Crear un nuevo cliente
        const customer = new Customer({ idType, idNumber, customerName, customerAddress, customerContact, customerEmail, customerPhoneNumber, createdBy });
        
        // Guardar el cliente en la base de datos
        await customer.save();

        res.status(201).json({ message: "Cliente registrado CON ÉXITO.", customer });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el cliente.", error: error.message });
    }
};

// Controlador para listar todos los clientes
export const customersList = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la lista de clientes.", error: error.message });
    }
};
