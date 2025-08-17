"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAuthcodeMail = void 0;
const mail_config_1 = require("../config/mail.config");
const createAuthCdoe = () => {
    return String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
};
// 인증코드를 보내고 코드를 return함
const sendAuthcodeMail = async (email) => {
    try {
        let code = createAuthCdoe();
        await mail_config_1.transporter.sendMail({
            from: "의문의 유저",
            to: email,
            subject: "pwf 인증코드",
            html: `
      PWF인증번호 6자리 <br>
      <p style="font-weight: bold; font-size: 20px"> ${code} </p>
      `,
        });
        return code;
    }
    catch (err) {
        throw err;
    }
};
exports.sendAuthcodeMail = sendAuthcodeMail;
// export const sendAuthcode = async () => {};
