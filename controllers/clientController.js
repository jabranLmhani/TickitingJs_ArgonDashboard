
const Client = require('../model/client');

const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createNewClient = async (req, res) => {
    const { nom, nbretoiles, numerotele, statut } = req.body;
    const client = new Client({
        nom,
        nbretoiles,
        numerotele,
        statut
    });

    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { nom, nbretoiles, numerotele, statut } = req.body;

    try {
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        if (nom) client.nom = nom;
        if (nbretoiles) client.nbretoiles = nbretoiles;
        if (numerotele) client.numerotele = numerotele;
        if (statut !== undefined) client.statut = statut;

        const updatedClient = await client.save();
        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteClient = async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete client with ID: ${id}`);

    try {
        const result = await Client.findByIdAndDelete(id);
        if (!result) {
            console.log(`Client with ID ${id} not found`);
            return res.status(404).json({ message: 'Client not found' });
        }

        console.log(`Client with ID ${id} deleted successfully`);
        res.json({ message: 'Client deleted' });
    } catch (err) {
        console.error(`Error deleting client with ID ${id}: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getClient = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const deleteSelectedClients = async (req, res) => {
    const { ids } = req.body;
    
    if (!ids || !ids.length) {
        return res.status(400).json({ message: 'No clients selected for deletion' });
    }

    try {
        const result = await Client.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No clients found for the provided IDs' });
        }

        res.json({ message: 'Clients successfully deleted', deletedCount: result.deletedCount });
    } catch (err) {
        console.error(`Error deleting clients: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    getAllClients,
    createNewClient,
    updateClient,
    deleteClient,
    deleteSelectedClients,
    getClient
};
