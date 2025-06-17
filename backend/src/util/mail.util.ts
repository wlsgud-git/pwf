import { transporter } from "../config/mail.config";

const createAuthCdoe = () => {
  return String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
};

// 인증코드를 보내고 코드를 return함
export const sendAuthcodeMail = async (email: string) => {
  try {
    let code: string = createAuthCdoe();
    await transporter.sendMail({
      from: "의문의 유저",
      to: email,
      subject: "pwf 인증코드",
      html: `
      PWF인증번호 6자리 <br>
      <p style="font-weight: bold; font-size: 20px"> ${code} </p>
      `,
    });
    return code;
  } catch (err) {
    throw err;
  }
};

// export const sendAuthcode = async () => {};
