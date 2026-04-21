import nodemailer from "nodemailer";

import { env } from "@/config";

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.SMTP_FROM) {
    throw new Error("SMTP configuration is incomplete.");
  }

  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  await getTransporter().sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
  });
};

export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
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

  await sendEmail(to, subject, html);
};
