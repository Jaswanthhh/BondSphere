module.exports = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  fromName: process.env.EMAIL_FROM_NAME || 'BondSphere',
  fromEmail: process.env.EMAIL_FROM_EMAIL || 'noreply@bondsphere.com',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  resetTokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  maxEmailsPerDay: 100,
  emailQueue: {
    concurrency: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
}; 