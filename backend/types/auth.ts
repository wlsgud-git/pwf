export enum SignupError {
  // 이메일
  EMAIL = "이메일 형식이 올바르지 않습니다.",
  EMAIL_OVERLAP = "이미 가입된 이메일입니다.",

  // 닉네임
  NICKNAME = "닉네임은 2 ~ 12자 이내여야 합니다.",
  NICKNAME_OVERLAP = "이미 존재하는 닉네임입니다.",

  PASSWORD = "비밀번호는 영문자, 숫자, 특수문자를 포함하여 8 ~ 20자 이내여야 합니다.",
  PASSWORD_CHECK = "비밀번호와 비밀번화 확인값이 다릅니다.",
}

export enum AuthcodeError {
  AUTHCODE_EXPIRE = "인증번호가 만료되었습니다.",
  AUTHCODE_UNEQUAL = "인증번호가 올바르지 않습니다.",
  AUTHCODE_RESEND = "인증번호를 재전송하였습니다.",
}

export enum SignupMessage {
  SUCCESS = "회원가입에 성공하였습니다.",
}

export enum LoginMessage {
  SUCCESS = "로그인에 성공하였습니다.",
  // 이메일
  EMAIL = "이메일 형식이 올바르지 않습니다.",
  EMAIL_UNDEFINED = "가입되어 있지 않은 이메일입니다.",
  // 비밀번호
  PASSWORD = "비밀번호는 영문자, 숫자, 특수문자를 포함하여 8 ~ 20자 이내여야 합니다.",
  PASSWORD_UNEQUAL = "비밀번호가 올바르지 않습니다.",
}
