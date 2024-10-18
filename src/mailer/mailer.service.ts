import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import verifyEmailTemplate from '../templates/verify-email.template';
import resetPasswordTemplate from '../templates/reset-password.template';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    actionLink: string,
  ): Promise<void> {
    const html = verifyEmailTemplate(name, actionLink);

    await this.sendMail(to, 'Verify your email address', html);
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    actionLink: string,
  ): Promise<void> {
    const html = resetPasswordTemplate(name, actionLink);

    await this.sendMail(to, 'Reset your password', html);
  }
}
