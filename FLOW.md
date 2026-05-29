Notification queue -> service_processor (user preferences and proper formatting of messages as per the required channels and pushed them to the respective channel topics) -> channel processors(Send the final message)

Redis service:
- it stored user channel info corresponding to userId:
    - like for email: user_email
    - for sms: user_mobile_number
    - for push: user_device_id or something like that.