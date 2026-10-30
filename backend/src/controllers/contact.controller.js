import nodemailer from "nodemailer";

const clean = (value) => typeof value === "string" ? value.trim() : "";
export async function submitContactMessage(req, res) {
  const name = clean(req.body?.name);
  const email = clean(req.body?.email).toLowerCase();
  const subject = clean(req.body?.subject);
  const message = clean(req.body?.message);
  const category = req.body?.category === "support" ? "Support" : "General enquiry";
  if (!name || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !subject || subject.length > 160 || !message || message.length > 5000) {
    return res.status(400).json({ success: false, message: "Please provide a valid name, email, subject and message." });
  }
  const { SMTP_Server, Login_brevo, brevo_pass, SMTP_name, sender, CONTACT_EMAIL } = process.env;
  if (!SMTP_Server || !Login_brevo || !brevo_pass || !sender || !CONTACT_EMAIL) {
    return res.status(503).json({ success: false, message: "The contact service is not configured yet. Please try again later." });
  }
  try {
    const transporter = nodemailer.createTransport({
      name: SMTP_name || "CampSync",
      host: SMTP_Server,
      port: 587,
      secure: false,
      auth: { user: Login_brevo, pass: brevo_pass },
    });
    await transporter.sendMail({
      from: '"CampSync website" <' + sender + '>',
      to: CONTACT_EMAIL,
      replyTo: { name, address: email },
      subject: "[CampSync " + category + "] " + subject,
      text: "Name: " + name + "\nEmail: " + email + "\nCategory: " + category + "\n\n" + message,
    });
    return res.status(200).json({ success: true, message: "Your message has been sent." });
  } catch (error) {
    console.error("Contact form delivery failed:", error?.message || error);
    return res.status(502).json({ success: false, message: "We couldn't deliver your message. Please try again later." });
  }
}
