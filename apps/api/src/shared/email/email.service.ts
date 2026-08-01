import { Config } from '@config';
import { OnIntegrationEvent } from '@decorator';
import {
  ForgotPasswordEvent,
  IntegrationEvent,
  ResendVerifyEmailRequestEvent,
  SystemAdminCreatedEvent,
  UserSignUpEvent,
} from '@events';
import { Injectable } from '@nestjs/common';
import { FileUploadData } from '@types';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Client from 'mailgun.js/client';

import { LogService } from 'src/utils/logger';

@Injectable()
export class EmailService {
  private _client: Client | null = null;
  private _logger = new LogService(EmailService.name);

  /** Lazily build the Mailgun client; returns null if no API key is set. */
  private getClient(): Client | null {
    if (this._client) {
      return this._client;
    }
    if (!Config.Email.ApiKey) {
      return null;
    }
    this._client = new Mailgun(formData).client({
      username: 'api',
      key: Config.Email.ApiKey,
    });
    return this._client;
  }

  async sendEmail(
    email: string,
    subject: string,
    text: string,
    html?: string,
    attachment?: FileUploadData,
  ) {
    const client = this.getClient();
    if (!client) {
      this._logger.log(
        `Email to ${email} ("${subject}") skipped — MAILGUN_API_KEY not configured`,
      );
      return;
    }
    try {
      await client.messages.create(Config.Email.DomainName, {
        from: Config.Email.SystemEmail,
        to: email,
        subject,
        text,
        html,
        attachment: attachment
          ? {
              data: attachment?.buffer,
              filename: attachment?.fieldname,
            }
          : undefined,
      });
    } catch (e) {
      this._logger.error(e);
    }
  }

  @OnIntegrationEvent(IntegrationEvent.UserSignUp)
  async handleUserCreatedEvent(payload: UserSignUpEvent) {
    const {
      user: { email, firstName, lastName, id },
      emailVerificationToken,
    } = payload;
    await this.sendEmail(
      email,
      `Welcome to ${Config.Server.AppName} - Start Exploring Now`,
      '',
      `<p>Hi ${firstName} ${lastName},</p>

      <p>Welcome to ${Config.Server.AppName}</p>
    
      <p>Please <a href="${
        Config.Server.Endpoint
      }/v1/auth/verify-email?token=${encodeURIComponent(
        emailVerificationToken,
      )}&id=${encodeURIComponent(id)}&email=${encodeURIComponent(
        email,
      )}" target="_blank">click here</a> to verify your email. </p>

      <p>
        Please <a href="${
          Config.Server.EditorPortal
        }" target="_blank">click here</a> to explore our app.
      </p>

      <p>Thanks</p>
      <p>${Config.Server.AppName} Team</p>`,
    );
  }

  @OnIntegrationEvent(IntegrationEvent.UserSuperAdminCreated)
  async handleSuperAdminCreatedEvent(payload: SystemAdminCreatedEvent) {
    const {
      user: { email, firstName, lastName, id },
      emailVerificationToken,
    } = payload;
    await this.sendEmail(
      email,
      'System Admin access for Portal',
      '',
      `
      <p>Hi ${firstName} ${lastName}, </p>
      <p>You are invited as a System Admin user for Design Studio.</p>

      <p>Please <a href="${
        Config.Server.Endpoint
      }/v1/auth/verify-email?token=${encodeURIComponent(
        emailVerificationToken,
      )}&id=${encodeURIComponent(id)}&email=${encodeURIComponent(
        email,
      )}" target="_blank">click here</a> to verify your email. </p>

      
      <p>Cheers</p>
      <p>${Config.Server.AppName} Team</p>`,
    );
  }

  @OnIntegrationEvent(IntegrationEvent.ForgotPasswordRequest)
  async handleForgotPasswordEvent(payload: ForgotPasswordEvent) {
    const {
      user: { id, email, firstName, lastName },
      passwordToken,
    } = payload;
    await this.sendEmail(
      email,
      `Create new password`,
      '',
      `
        <p>Hi ${firstName} ${lastName},</p>

        <p>
          You recently requested to reset the password for your account. Please <a href="${
            Config.Server.EditorPortal
          }/set-password?tk=${
        passwordToken ? encodeURIComponent(passwordToken) : null
      }&id=${encodeURIComponent(id)}&firstName=${encodeURIComponent(
        firstName,
      )}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(
        email,
      )}" target="_blank">click here</a> to proceed with creating a new password.
        </p>

        <p>
        If you did not request a password reset, please ignore this email or reply to let us know.
        </p>

        <p>
          For more information, please reach out to <a href = "mailto:${
            Config.Email.SystemEmail
          }">${Config.Email.SystemEmail}</a>
        </p>
        <p>
          Thank you,
          <br />
          ${Config.Server.AppName} Team
        </p>`,
    );
  }

  @OnIntegrationEvent(IntegrationEvent.ResendVerifyEmailRequest)
  async handleResendVerifyEmailEvent(payload: ResendVerifyEmailRequestEvent) {
    const {
      user: { email, firstName, lastName, id },
      emailVerificationToken,
    } = payload;
    await this.sendEmail(
      email,
      'Verify your email',
      '',
      `
      <p>Hi ${firstName} ${lastName}, </p>

      <p>Please <a href="${
        Config.Server.Endpoint
      }/v1/auth/verify-email?token=${encodeURIComponent(
        emailVerificationToken,
      )}&id=${encodeURIComponent(id)}&email=${encodeURIComponent(
        email,
      )}" target="_blank">click here</a> to verify your email. </p>

      
      <p>Cheers</p>
      <p>${Config.Server.AppName} Team</p>`,
    );
  }
}
