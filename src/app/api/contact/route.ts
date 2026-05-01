import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactName, businessName, phone, email, city, annualTurnover, message } = body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'info.swastigold@gmail.com',
        pass: 'rhag ygom absc insy', // App password provided by user
      },
    });

    const mailOptions = {
      from: 'info.swastigold@gmail.com',
      to: 'info.swastigold@gmail.com',
      subject: `New Wholesale Enquiry: ${businessName || contactName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #c5a059;">New Wholesale Enquiry</h2>
          <p><strong>Business Name:</strong> ${businessName || 'N/A'}</p>
          <p><strong>Contact Name:</strong> ${contactName}</p>
          <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Annual Turnover:</strong> ${annualTurnover || 'N/A'}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message || 'No message provided'}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
