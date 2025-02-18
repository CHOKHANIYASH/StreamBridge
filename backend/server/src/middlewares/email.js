const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "streambridge72@gmail.com",
    pass: process.env.STREAMBRIDGE_EMAIL_PASSWORD,
  },
});

const welcomeMail = async (email) => {
  const info = await transporter.sendMail({
    from: "streambridge72@gmail.com", // Sender address
    to: `${email}`, // Recipient's email
    subject: "Welcome to StreamBridge 🎥", // Subject line
    html: `
        <div style="font-size: 16px; padding: 20px; font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; border-radius: 10px; margin: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 20px;">
          <p>Thank you for signing up!..</p>
          <p>Welcome to StreamBridge,</p>
          <p> The ultimate platform for effortless video uploading and streaming! 🚀
                With StreamBridge, you can:
                <ul>
                  <li>📤 Upload your video and get an HLS-formatted URL instantly.</li>
                  <li>⚡ Stream videos efficiently with high-quality playback.</li>
                  <li>📺 Watch and share videos with ease.</li>
                </ul>

                Our goal is to make video sharing fast, smooth, and accessible for everyone. Start using StreamBridge today!

                Best,
                The StreamBridge Team 🎥🚀
            </p>
        </div>
      `,
  });

  console.log("Email sent: ", info.messageId);
};
const successMail = async (email, name) => {
  const info = await transporter.sendMail({
    from: "streambridge72@gmail.com", // Sender address
    to: `${email}`, // Recipient's email
    subject: "Video hls transcoding Completed ", // Subject line
    html: `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; 
                  border-radius: 10px; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; 
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); font-size: 16px; line-height: 1.5;">
        <h2 style="color: #2c3e50;">🎉 Video Transcoding Completed!</h2>
        <p>Hi,</p>
        <p>Your video <strong>${name}</strong> has been successfully uploaded and transcoded.</p>
        <p>You can now access the HLS URL from your dashboard.</p>
        <p>Thank you for using <strong>StreamBridge</strong>!</p>
        <br>
        <p>Best Regards,<br><strong>StreamBridge Team</strong></p>
      </div>
    `,
  });

  console.log("Email sent: ", info.messageId);
};

module.exports = { welcomeMail, successMail };
