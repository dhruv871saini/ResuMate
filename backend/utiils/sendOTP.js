import transporter from "../config/mailer.js";
 export const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"My Project" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      html: `
        <div style="font-family:sans-serif">
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log("OTP sent");
  } catch (error) {
    console.log(error);
  }
};

 // password (scah xoqq bfxy ulqg)
 // username (dhruvsaini871tech)