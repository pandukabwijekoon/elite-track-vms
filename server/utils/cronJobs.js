const cron = require('node-cron');
const Vehicle = require('../models/Vehicle');
const sendEmail = require('./mail');

/**
 * Scheduled Intelligence: Premium Reminders
 * Runs every day at 09:00 AM
 */
const initCronJobs = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('🏁 Running Daily Service Milestone Scan...');
    
    try {
      const vehicles = await Vehicle.find().populate('owner');
      const now = new Date();
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

      for (const vehicle of vehicles) {
        if (!vehicle.owner || !vehicle.owner.email) continue;

        // 1. Check Service Milestone (Within 500KM of interval)
        const nextServiceKM = (vehicle.lastServiceMileage || 0) + (vehicle.serviceInterval || 12000);
        const kmRemaining = nextServiceKM - vehicle.mileage;

        if (kmRemaining <= 500 && !vehicle.serviceReminderSent) {
          await sendServiceReminder(vehicle, kmRemaining);
          vehicle.serviceReminderSent = true;
          await vehicle.save();
        }

        // 2. Check Document expirations (Within 7 days)
        if (vehicle.documents && vehicle.documents.length > 0) {
          for (const doc of vehicle.documents) {
            const timeDiff = new Date(doc.expiryDate) - now;
            
            if (timeDiff > 0 && timeDiff <= SEVEN_DAYS_MS && !vehicle.documentRemindersSent.includes(doc._id.toString())) {
              await sendDocumentExpiryAlert(vehicle, doc);
              vehicle.documentRemindersSent.push(doc._id.toString());
              await vehicle.save();
            }
          }
        }
      }
    } catch (err) {
      console.error('❌ Cron Job Error:', err);
    }
  });
};

const sendServiceReminder = async (vehicle, kmRemaining) => {
  const html = `
    <div style="background: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #00f0ff;">
      <h1 style="color: #00f0ff; letter-spacing: 2px;">PREMIUM SERVICE ALERT</h1>
      <p style="font-size: 1.2rem;">Commander, your <b>${vehicle.make} ${vehicle.model}</b> is approaching a critical maintenance milestone.</p>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;">Current Mileage: <b>${vehicle.mileage} KM</b></p>
        <p style="margin: 5px 0;">Range until Service: <span style="color: #ff0055;">${kmRemaining} KM</span></p>
      </div>
      <p>Log your service in the EliteTrack dashboard to reset this alert and maintain your vehicle's health score.</p>
      <a href="http://localhost:5173/services" style="display: inline-block; background: #00f0ff; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; margin-top: 20px;">DASHBOARD ACCESS</a>
    </div>
  `;

  await sendEmail({
    email: vehicle.owner.email,
    subject: `🚨 Service Milestone: ${vehicle.make} ${vehicle.model} (${kmRemaining} KM remaining)`,
    html
  });
};

const sendDocumentExpiryAlert = async (vehicle, doc) => {
  const html = `
    <div style="background: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #ff0055;">
      <h1 style="color: #ff0055; letter-spacing: 2px;">DOCUMENT EXPIRY ALERT</h1>
      <p style="font-size: 1.2rem;">Action Required: The <b>${doc.type}</b> for your <b>${vehicle.make} ${vehicle.model}</b> is expiring soon.</p>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;">Expiry Date: <b>${new Date(doc.expiryDate).toDateString()}</b></p>
        <p style="margin: 5px 0;">Reg Number: <b>${vehicle.registrationNumber}</b></p>
      </div>
      <p>Please update your vault records to ensure continuous compliance.</p>
      <a href="http://localhost:5173/glovebox" style="display: inline-block; background: #ff0055; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; margin-top: 20px;">VAULT ACCESS</a>
    </div>
  `;

  await sendEmail({
    email: vehicle.owner.email,
    subject: `⚠️ Expiry Alert: ${doc.type} for ${vehicle.registrationNumber}`,
    html
  });
};

module.exports = initCronJobs;
