import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { mailConfig } from '../../config/mailEnv';
import type { EmailProvider, SendEmailInput } from './EmailProvider';

export class NodemailerEmailProvider implements EmailProvider {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: mailConfig.secure,
        auth: {
          user: mailConfig.user,
          pass: mailConfig.pass,
        },
      });
    }
    return this.transporter;
  }

  async send(input: SendEmailInput): Promise<void> {
    await this.getTransporter().sendMail({
      from: mailConfig.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  }
}
