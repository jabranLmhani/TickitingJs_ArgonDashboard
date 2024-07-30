const Demandeur = require('../model/demandeur');


const createNewDemandeur = async (req, res) => {
    const { nom, signalerprobleme_description, signalerprobleme_type, client } = req.body;
    try {
        const newDemandeur = new Demandeur({ nom, signalerprobleme_description, signalerprobleme_type, client });
        const savedDemandeur = await newDemandeur.save();
        res.status(201).json(savedDemandeur);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};


const getAllDemandeurs = async (req, res) => {
    try {
        const demandeurs = await Demandeur.find().populate('client');
        res.status(200).json(demandeurs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


const getDemandeur = async (req, res) => {
    const { id } = req.params;
    try {
        const demandeur = await Demandeur.findById(id).populate('client');
        if (!demandeur) return res.status(404).json({ message: 'Demandeur not found' });
        res.status(200).json(demandeur);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


const updateDemandeur = async (req, res) => {
    const { id } = req.params;
    const { nom, signalerprobleme_description, signalerprobleme_type, client } = req.body;
    try {
        const updatedDemandeur = await Demandeur.findByIdAndUpdate(id, { nom, signalerprobleme_description, signalerprobleme_type, client }, { new: true });
        if (!updatedDemandeur) return res.status(404).json({ message: 'Demandeur not found' });
        res.status(200).json(updatedDemandeur);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};


const deleteDemandeur = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDemandeur = await Demandeur.findByIdAndDelete(id);
        if (!deletedDemandeur) return res.status(404).json({ message: 'Demandeur not found' });
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createNewDemandeur,
    getAllDemandeurs,
    getDemandeur,
    updateDemandeur,
    deleteDemandeur
};
