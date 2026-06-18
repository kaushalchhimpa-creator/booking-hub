const User = require('../models/User');

exports.getProviders = async (req, res) => {
    try {
        const { category } = req.query;
        let query = { role: 'Provider' }; 

        if (category) {
            query.category = category;
        }

        const providers = await User.find(query).select('-password');
        res.status(200).json({ success: true, data: providers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};