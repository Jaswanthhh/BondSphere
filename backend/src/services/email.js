const nodemailer = require('nodemailer');
const config = require('../config/email');
const templates = require('../templates/email');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
    const html = templates.passwordReset({
      name: user.name,
      resetUrl
    });

    const mailOptions = {
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: user.email,
      subject: 'Reset Your Password',
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const html = templates.welcome({
      name: user.name
    });

    const mailOptions = {
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: user.email,
      subject: 'Welcome to BondSphere!',
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send friend request email
const sendFriendRequestEmail = async (user, friend) => {
  try {
    const profileUrl = `${config.clientUrl}/profile/${friend._id}`;
    const html = templates.friendRequest({
      name: user.name,
      friendName: friend.name,
      profileUrl
    });

    const mailOptions = {
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: friend.email,
      subject: `${user.name} sent you a friend request`,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending friend request email:', error);
    return false;
  }
};

// Send community invite email
const sendCommunityInviteEmail = async (user, community, invitee) => {
  try {
    const communityUrl = `${config.clientUrl}/communities/${community._id}`;
    const html = templates.communityInvite({
      name: user.name,
      communityName: community.name,
      communityUrl
    });

    const mailOptions = {
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: invitee.email,
      subject: `${user.name} invited you to join ${community.name}`,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending community invite email:', error);
    return false;
  }
};

// Send achievement email
const sendAchievementEmail = async (user, achievement) => {
  try {
    const profileUrl = `${config.clientUrl}/profile/${user._id}`;
    const html = templates.achievement({
      name: user.name,
      achievementName: achievement.name,
      achievementDescription: achievement.description,
      profileUrl
    });

    const mailOptions = {
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: user.email,
      subject: `Achievement Unlocked: ${achievement.name}`,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending achievement email:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendFriendRequestEmail,
  sendCommunityInviteEmail,
  sendAchievementEmail
}; 