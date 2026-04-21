"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config");
let transporter = null;
const getTransporter = () => {
    if (!config_1.env.SMTP_HOST || !config_1.env.SMTP_USER || !config_1.env.SMTP_PASS || !config_1.env.SMTP_FROM) {
        throw new Error("SMTP configuration is incomplete.");
    }
    if (transporter)
        return transporter;
    transporter = nodemailer_1.default.createTransport({
        host: config_1.env.SMTP_HOST,
        port: config_1.env.SMTP_PORT,
        secure: config_1.env.SMTP_SECURE,
        auth: {
            user: config_1.env.SMTP_USER,
            pass: config_1.env.SMTP_PASS,
        },
    });
    return transporter;
};
const sendEmail = async (to, subject, html) => {
    await getTransporter().sendMail({
        from: config_1.env.SMTP_FROM,
        to,
        subject,
        html,
    });
};
exports.sendEmail = sendEmail;
const sendOtpEmail = async (to, otp) => {
    const subject = "Medistock - И-мэйл баталгаажуулалт";
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Medistock-д тавтай морилно уу!</h2>
      <p>Таны бүртгэлийг баталгаажуулах 6 оронтой кодыг доор илгээлээ:</p>
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
        ${otp}
      </div>
      <p>Энэ код 10 минутын хугацаанд хүчинтэй байна.</p>
      <p>Хэрэв та энэ хүсэлтийг өөрөө илгээгээгүй бол энэ имэйлийг үл тоомсорлоно уу.</p>
      <br>
      <p>Medistock баг</p>
    </div>
  `;
    await (0, exports.sendEmail)(to, subject, html);
};
exports.sendOtpEmail = sendOtpEmail;
//# sourceMappingURL=index.js.map