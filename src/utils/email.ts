import process from 'node:process';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

let client: SESClient;

export function getEmailClient() {
  if (!client) {
    client = new SESClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
      region: process.env.AWS_REGION as string,
    });
  }

  return client;
}
