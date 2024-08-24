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
    console.log('Received request for demandeurs');
    try {
        const searchQuery = req.query.search || ''; // Retrieve search query
        const demandeurs = await Demandeur.find({ nom: { $regex: searchQuery, $options: 'i' } }).populate('client');
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

const deleteSelectedDemandeurs = async (req, res) => {
    const { ids } = req.body; // Expecting an array of IDs in the request body
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No demandeur IDs provided or invalid format' });
    }

    try {
        const result = await Demandeur.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No demandeurs found to delete' });
        }
        res.status(204).end(); // No content to return after successful deletion
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
    deleteDemandeur,
    deleteSelectedDemandeurs
};