export enum EmailError {
  // 이메일
  EMAIL_EMPTY = "이메일을 입력하세요",
  EMAIL_FORM_ERROR = "이메일 형식이 올바르지 않습니다.",
  EMAIL_OVERLAP_ERROR = "이미 가입된 이메일입니다.",
  EMAIL_UNDEFINED_ERROR = "가입되어 있지 않은 이메일입니다.",
}

export enum NicknameError {
  // 닉네임
  NICKNAME_FORM_ERROR = "닉네임은 2 ~ 12자 이내여야 합니다.",
  NICKNAME_OVERLAP_ERROR = "이미 존재하는 닉네임입니다.",
}

export enum PasswordError {
  PASSWORD_FORM_ERROR = "비밀번호는 영문자, 숫자, 특수문자를 포함하여 8 ~ 20자 이내여야 합니다.",
  PASSWORD_CHECK_ERROR = "비밀번호와 비밀번호 확인값이 다릅니다.",
  PASSWORD_UNEQUAL_ERROR = "비밀번호가 올바르지 않습니다.",
}

export enum AuthcodeError {
  AUTHCODE_LEN_ERROR = "인증번호는 6자리 입니다.",
  AUTHCODE_ONLY_NUM = "인증번호는 숫자만 가능합니다.",
  AUTHCODE_EXPIRE = "인증번호가 만료되었습니다.",
  AUTHCODE_UNEQUAL = "인증번호가 올바르지 않습니다.",
  AUTHCODE_RESEND = "인증번호를 재전송하였습니다.",
}

export enum SignupMessage {
  SUCCESS = "회원가입에 성공하였습니다.",
}

export enum LoginMessage {
  SUCCESS = "로그인에 성공하였습니다.",
}
