
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

    try {
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        await client.remove();
        res.json({ message: 'Client deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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

module.exports = {
    getAllClients,
    createNewClient,
    updateClient,
    deleteClient,
    getClient
};
