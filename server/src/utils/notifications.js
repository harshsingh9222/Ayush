import nodemailer from 'nodemailer'
import twilio from 'twilio'
import Business from '../models/Business.model.js'
import { asyncHandler } from './asyncHandler.js'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
})

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const SMS_FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER

// Wrap in asyncHandler if you’re using express‐style error middleware
const sendSubmissionNotifications = async (fund) => {
  try {
    // 1. Fetch the Business
    const business = await Business.findById(fund.businessId)
    if (!business) throw new Error('Business not found for notifications.')

    const { email, mobileNo, businessName } = business
    const userName  = businessName

    // 2. Prepare email fields
    if (!email) {
      console.error('❌ Business has no email; skipping email notification.')
    } else {
      const userEmail   = email
      const refNo       = fund.applicationReferenceNumber
      const schemeName  = fund.scheme
      const subcomp     = fund.subcomponent
      const emailSubject = `AYUSH Grant Application Received – Reference ${refNo}`
      const emailBody    = `
Dear ${userName},

Your application under ${schemeName} (${subcomp}) has been received.
Your Reference Number is ${refNo}.

You will receive further updates via email/SMS as your application moves forward.

Thank you for applying!

– Ayush Grant Administration
      `

      try {
        await transporter.sendMail({
          from: process.env.MAIL_USER, // Your verified Gmail
          to: userEmail,
          subject: emailSubject,
          text: emailBody,
        })
        console.log(`📧 Email sent to ${userEmail}`)
      } catch (err) {
        console.error('❌ Error sending email:', err)
      }
    }

    // 3. Prepare SMS fields
    if (!mobileNo) {
      console.error('❌ Business has no mobileNo; skipping SMS.')
    } else {
      // Prepend country code if not already included
      let userMobile = mobileNo.startsWith('+') ? mobileNo : '+91' + mobileNo
      const refNo      = fund.applicationReferenceNumber
      const schemeName = fund.scheme
      const subcomp    = fund.subcomponent

      const smsBody = `Dear ${userName}, your AYUSH application under ${schemeName} (${subcomp}) has been received. Ref#: ${refNo}.`

      try {
        await twilioClient.messages.create({
          from: SMS_FROM_NUMBER,
          to: userMobile,
          body: smsBody,
        })
        console.log(`📱 SMS sent to ${userMobile}`)
      } catch (err) {
        console.error('❌ Error sending SMS:', err)
      }
    }
  } catch (err) {
    console.error('❌ Error in sendSubmissionNotifications:', err)
  }
}

export { sendSubmissionNotifications }
