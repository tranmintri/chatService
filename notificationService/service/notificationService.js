const { v4: uuidv4 } = require('uuid');
const { Notification } = require('../models/notification');
const admin = require("firebase-admin")
const {db} = require('../config/firebase')

const getNotifications = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const docRef = db.collection('notifications').doc(userId);
        const doc = await docRef.get();
        if (doc.exists) {
            res.status(200).json(doc.data());
        } else {
            res.status(404).json({msg:"Notifications not found"});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addNotification = async (req, res, next) => {
    const { userId } = req.params;
    const { notification } = req.body;
    try {
        const docRef = db.collection('notifications').doc(userId);
        await docRef.set({ notification }, { merge: true });
        res.status(200).json({msg:"Notification added successfully"});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getNotifications,
    addNotification
};