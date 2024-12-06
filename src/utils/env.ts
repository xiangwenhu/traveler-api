import process from 'node:process';
import { ZodError, z } from 'zod';
import 'dotenv/config';

const configSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d{4,5}$/)
    .optional()
    .default('3000'),
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      url => url.startsWith('mysql://') || url.startsWith('mysql://'),
      'DB_URL must be a valid mysql url',
    ),
  FROM_NAME: z.string().default('Verify'),
  FROM_EMAIL: z.string().email(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  JWT_SECRET: z.string(),
  ARGON_2_SALT: z.string(),
  ALI_ACC_ID: z.string(),
  ALI_ACC_SECRET: z.string(),
  ALI_OSS_ACS_RAM: z.string(),
  ALI_OSS_BUCKET: z.string(),
  ALI_OSS_REGION: z.string(),
  AMAP_KEY: z.string(),
  ALI_ACE_END_POINT: z.string(),
  ALI_OSS_T_BUCKET_ROOT: z.string()
});

try {
  configSchema.parse(process.env);
}
catch (error) {
  if (error instanceof ZodError)
    console.error(error.errors);

  process.exit(1);
}

export type Env = z.infer<typeof configSchema>;
