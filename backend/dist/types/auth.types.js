"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginMessage = exports.SignupMessage = exports.AuthcodeError = exports.PasswordError = exports.NicknameError = exports.EmailError = void 0;
var EmailError;
(function (EmailError) {
    // 이메일
    EmailError["EMAIL_EMPTY"] = "\uC774\uBA54\uC77C\uC744 \uC785\uB825\uD558\uC138\uC694";
    EmailError["EMAIL_FORM_ERROR"] = "\uC774\uBA54\uC77C \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
    EmailError["EMAIL_OVERLAP_ERROR"] = "\uC774\uBBF8 \uAC00\uC785\uB41C \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4.";
    EmailError["EMAIL_UNDEFINED_ERROR"] = "\uAC00\uC785\uB418\uC5B4 \uC788\uC9C0 \uC54A\uC740 \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4.";
})(EmailError || (exports.EmailError = EmailError = {}));
var NicknameError;
(function (NicknameError) {
    // 닉네임
    NicknameError["NICKNAME_FORM_ERROR"] = "\uB2C9\uB124\uC784\uC740 2 ~ 12\uC790 \uC774\uB0B4\uC5EC\uC57C \uD569\uB2C8\uB2E4.";
    NicknameError["NICKNAME_OVERLAP_ERROR"] = "\uC774\uBBF8 \uC874\uC7AC\uD558\uB294 \uB2C9\uB124\uC784\uC785\uB2C8\uB2E4.";
})(NicknameError || (exports.NicknameError = NicknameError = {}));
var PasswordError;
(function (PasswordError) {
    PasswordError["PASSWORD_FORM_ERROR"] = "\uBE44\uBC00\uBC88\uD638\uB294 \uC601\uBB38\uC790, \uC22B\uC790, \uD2B9\uC218\uBB38\uC790\uB97C \uD3EC\uD568\uD558\uC5EC 8 ~ 20\uC790 \uC774\uB0B4\uC5EC\uC57C \uD569\uB2C8\uB2E4.";
    PasswordError["PASSWORD_CHECK_ERROR"] = "\uBE44\uBC00\uBC88\uD638\uC640 \uBE44\uBC00\uBC88\uD638 \uD655\uC778\uAC12\uC774 \uB2E4\uB985\uB2C8\uB2E4.";
    PasswordError["PASSWORD_UNEQUAL_ERROR"] = "\uBE44\uBC00\uBC88\uD638\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
})(PasswordError || (exports.PasswordError = PasswordError = {}));
var AuthcodeError;
(function (AuthcodeError) {
    AuthcodeError["AUTHCODE_LEN_ERROR"] = "\uC778\uC99D\uBC88\uD638\uB294 6\uC790\uB9AC \uC785\uB2C8\uB2E4.";
    AuthcodeError["AUTHCODE_ONLY_NUM"] = "\uC778\uC99D\uBC88\uD638\uB294 \uC22B\uC790\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4.";
    AuthcodeError["AUTHCODE_EXPIRE"] = "\uC778\uC99D\uBC88\uD638\uAC00 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.";
    AuthcodeError["AUTHCODE_UNEQUAL"] = "\uC778\uC99D\uBC88\uD638\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
    AuthcodeError["AUTHCODE_RESEND"] = "\uC778\uC99D\uBC88\uD638\uB97C \uC7AC\uC804\uC1A1\uD558\uC600\uC2B5\uB2C8\uB2E4.";
})(AuthcodeError || (exports.AuthcodeError = AuthcodeError = {}));
var SignupMessage;
(function (SignupMessage) {
    SignupMessage["SUCCESS"] = "\uD68C\uC6D0\uAC00\uC785\uC5D0 \uC131\uACF5\uD558\uC600\uC2B5\uB2C8\uB2E4.";
})(SignupMessage || (exports.SignupMessage = SignupMessage = {}));
var LoginMessage;
(function (LoginMessage) {
    LoginMessage["SUCCESS"] = "\uB85C\uADF8\uC778\uC5D0 \uC131\uACF5\uD558\uC600\uC2B5\uB2C8\uB2E4.";
})(LoginMessage || (exports.LoginMessage = LoginMessage = {}));
