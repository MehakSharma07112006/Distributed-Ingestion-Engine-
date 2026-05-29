// // config.ts
// import { z } from 'zod';

// const envSchema = z.object({
//   CHANNEL_USER_INFO_ENDPOINT: z.string(),
// });

// const parsed = envSchema.safeParse(process.env);

// if (!parsed.success) {
//   console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
//   process.exit(1);
// }

// export const env = parsed.data;
