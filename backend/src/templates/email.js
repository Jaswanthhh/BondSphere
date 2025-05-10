const fs = require('fs');
const path = require('path');

// Read template files
const templates = {
  passwordReset: fs.readFileSync(path.join(__dirname, 'password-reset.html'), 'utf8'),
  welcome: fs.readFileSync(path.join(__dirname, 'welcome.html'), 'utf8'),
  friendRequest: fs.readFileSync(path.join(__dirname, 'friend-request.html'), 'utf8'),
  communityInvite: fs.readFileSync(path.join(__dirname, 'community-invite.html'), 'utf8'),
  achievement: fs.readFileSync(path.join(__dirname, 'achievement.html'), 'utf8')
};

// Replace placeholders in templates
const replacePlaceholders = (template, data) => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || '');
};

// Password reset template
const passwordReset = (data) => {
  return replacePlaceholders(templates.passwordReset, {
    name: data.name,
    resetUrl: data.resetUrl
  });
};

// Welcome template
const welcome = (data) => {
  return replacePlaceholders(templates.welcome, {
    name: data.name
  });
};

// Friend request template
const friendRequest = (data) => {
  return replacePlaceholders(templates.friendRequest, {
    name: data.name,
    friendName: data.friendName,
    profileUrl: data.profileUrl
  });
};

// Community invite template
const communityInvite = (data) => {
  return replacePlaceholders(templates.communityInvite, {
    name: data.name,
    communityName: data.communityName,
    communityUrl: data.communityUrl
  });
};

// Achievement template
const achievement = (data) => {
  return replacePlaceholders(templates.achievement, {
    name: data.name,
    achievementName: data.achievementName,
    achievementDescription: data.achievementDescription,
    profileUrl: data.profileUrl
  });
};

module.exports = {
  passwordReset,
  welcome,
  friendRequest,
  communityInvite,
  achievement
}; 