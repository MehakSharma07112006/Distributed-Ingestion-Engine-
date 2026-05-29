import express, { Request, Response } from 'express';
import { z } from 'zod';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors())
// Schema
const userChannelInfoSchema = z.object({
  channel_email: z.string(),
  channel_sms: z.string(),
  channel_push: z.string(),
  channel_webhook: z.string(),
});

// 🔥 Simulated user "DB"
const userDB = {
  user_001: {
    channel_email: 'dotasararishabh@gmail.com',
    channel_sms: '+1111111111',
    channel_push: 'push_token_alice',
    channel_webhook: 'https://webhook.site/alice',
  },
  user_002: {
    channel_email: 'bob@example.com',
    channel_sms: '+2222222222',
    channel_push: 'push_token_bob',
    channel_webhook: 'https://webhook.site/bob',
  },
  user_003: {
    channel_email: 'carol@example.com',
    channel_sms: '+3333333333',
    channel_push: 'push_token_carol',
    channel_webhook: 'https://webhook.site/carol',
  },
  user_004: {
    channel_email: 'dave@example.com',
    channel_sms: '+4444444444',
    channel_push: 'push_token_dave',
    channel_webhook: 'https://webhook.site/dave',
  },
  user_005: {
    // Purposely missing one field to test validation
    channel_email: 'eve@example.com',
    channel_sms: '+5555555555',
    channel_push: 'push_token_eve',
    // Missing webhook!
  },
};

// @ts-ignore
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
//   @ts-ignore 
  const userData = userDB[userId];

  if (!userData) {
    return res.status(404).json({ error: 'User not found' });
  }

  const result = userChannelInfoSchema.safeParse(userData);

  if (!result.success) {
    return res.status(500).json({ error: 'User data invalid', issues: result.error.issues });
  }

  return res.json({data:result.data});
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
