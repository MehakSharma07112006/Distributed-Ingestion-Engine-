import { z } from "zod";


export const messageSchema = z.object({
  email:z.object({
    subject:z.string(),
    body:z.string(),
  }).optional(),
  sms:z.object({
    text:z.string()
  }).optional(),
  push:z.object({
    text:z.string()
  }).optional(),
  webhook:z.object({
    text:z.string()
  }).optional()
})

export type messageType = z.infer<typeof messageSchema>

export const userChannelInfoSchema = z.object({
  channel_email: z.string(),
  channel_sms: z.string(),
  channel_push: z.string(),
  channel_webhook: z.string(),
})

export type UserChannelInfo = z.infer<typeof userChannelInfoSchema>;


export const NotificationSchema = z.object({
  userId: z.string(),
  employUserPreferences: z.boolean(),
  message: messageSchema,
  channels: z.array(z.string()),
  notificationId: z.string(),
  notificationType: z.string(),
  sendAt: z.preprocess((val:any) => new Date(val as string), z.date()),
  channel_info: z.string().optional()
});

export type Notification = z.infer<typeof NotificationSchema>;


