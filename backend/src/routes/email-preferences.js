const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const EmailPreference = require('../models/EmailPreference');
const { validateEmailPreferences } = require('../middleware/validation');

// Get user's email preferences
router.get('/', auth, async (req, res) => {
  try {
    const preferences = await EmailPreference.getOrCreate(req.user._id);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update email preferences
router.put('/', auth, validateEmailPreferences, async (req, res) => {
  try {
    const preferences = await EmailPreference.getOrCreate(req.user._id);
    await preferences.updatePreferences(req.body.preferences);
    
    if (req.body.frequency) {
      preferences.frequency = req.body.frequency;
      await preferences.save();
    }
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update specific category preferences
router.put('/:category', auth, validateEmailPreferences, async (req, res) => {
  try {
    const { category } = req.params;
    const preferences = await EmailPreference.getOrCreate(req.user._id);
    
    if (!preferences.preferences[category]) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    await preferences.updatePreferences({ [category]: req.body });
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unsubscribe from all emails
router.post('/unsubscribe', auth, async (req, res) => {
  try {
    const preferences = await EmailPreference.getOrCreate(req.user._id);
    
    // Disable all preferences
    Object.keys(preferences.preferences).forEach(category => {
      Object.keys(preferences.preferences[category]).forEach(pref => {
        preferences.preferences[category][pref] = false;
      });
    });
    
    await preferences.save();
    res.json({ message: 'Successfully unsubscribed from all emails' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resubscribe to all emails
router.post('/resubscribe', auth, async (req, res) => {
  try {
    const preferences = await EmailPreference.getOrCreate(req.user._id);
    
    // Enable all preferences
    Object.keys(preferences.preferences).forEach(category => {
      Object.keys(preferences.preferences[category]).forEach(pref => {
        preferences.preferences[category][pref] = true;
      });
    });
    
    await preferences.save();
    res.json({ message: 'Successfully resubscribed to all emails' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 