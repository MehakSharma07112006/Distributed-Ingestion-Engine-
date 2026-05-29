import { create } from "domain";
import nodemailer, { TestAccount, Transporter } from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport";

async function createAccount():Promise<TestAccount | undefined>
{
    try 
    {
        // Create a test account
        const account = await nodemailer.createTestAccount();

        return account
    }
    catch(err)
    {
        console.error("[ERROR] Error in creating Test account: ", err);
    }
}

let testAccount:TestAccount | undefined;
createAccount().then((account:TestAccount | undefined) => {
    testAccount = account;
    console.log("[INFO] Test account created: ", testAccount);
}).catch((err) => {
    console.error("[ERROR] Error in creating Test account: ", err);
});
async function createTransport()
{
    try 
    {
        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: testAccount?.smtp.host,
            port: testAccount?.smtp.port,
            secure: testAccount?.smtp.secure, // true for 465, false for other ports
            auth: {
                user: testAccount?.user, // generated ethereal user
                pass: testAccount?.pass // generated ethereal password
            }
        });

        return transporter;
    }
    catch(err)
    {
        console.log("[ERROR] Error creating Transport!")
    }
}

export async function sendEmailNotification(
    to: string,
    subject: string,
    body: string,
) {

    const transporter = await createTransport();
    
    let message:MailOptions = {
        from: 'noreply@notify.org',
        to: to,
        subject: subject,
        text: 'Test Email',
        html: body,
    };

    transporter?.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}

