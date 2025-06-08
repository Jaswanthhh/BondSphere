const Travel = require('../models/Travel');

exports.createTravel = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;
    if (req.body.createdAt) delete req.body.createdAt;
    if (req.body.__v) delete req.body.__v;
    const creator = req.user?.id || req.body.creator || null;
    const travel = new Travel({
      ...req.body,
      creator,
    });
    await travel.save();
    res.status(201).json(travel);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create travel listing', error: err.message });
  }
};

exports.getAllTravels = async (req, res) => {
  try {
    const travels = await Travel.find().sort({ createdAt: -1 }).populate('creator', 'username fullName avatar');
    res.json(travels);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch travel listings', error: err.message });
  }
};

exports.getTravelById = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id).populate('creator', 'username fullName avatar');
    if (!travel) {
      return res.status(404).json({ msg: 'Travel listing not found' });
    }
    res.json(travel);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch travel details', error: err.message });
  }
};

exports.updateTravel = (req, res) => {
  res.send('Update travel');
};

exports.deleteTravel = async (req, res) => {
  try {
    const travel = await Travel.findByIdAndDelete(req.params.id);
    if (!travel) {
      return res.status(404).json({ msg: 'Travel listing not found' });
    }
    res.json({ msg: 'Travel listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete travel listing', error: err.message });
  }
}; 