export enum EmailError {
  EMAIL_FORM_ERROR = "이메일 형식이 올바르지 않습니다.",
  EMAIL_OVERLAP_ERROR = "이미 가입된 이메일입니다.",
  EMAIL_UNDEFINED_ERROR = "가입되어 있지 않은 이메일입니다.",
}

export enum NicknameError {
  NICKNAME_FORM_ERROR = "닉네임은 2 ~ 12자 이내여야 합니다.",
  NICKNAME_OVERLAP_ERROR = "이미 존재하는 닉네임입니다.",
}

export enum PasswordError {
  // 비밀번호
  PASSWORD_FORM_ERROR = "비밀번호는 영문자, 숫자, 특수문자를 포함하여 8 ~ 20자 이내여야 합니다.",
  PASSWORD_CHECK_ERROR = "비밀번호와 비밀번화 확인값이 다릅니다.",
  PASSWORD_UNEQUAL_ERRROR = "비밀번호가 올바르지 않습니다.",
}

export enum SignupMessage {
  SUCCESS = "회원가입에 성공하였습니다.",
}
