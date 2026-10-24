const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 24;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 16;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

export const isValidName = (name: string) => {
  return (/^[A-Za-z\s'-]+$/.test(name) && name.length >= NAME_MIN_LENGTH && name.length <= NAME_MAX_LENGTH);
}

export const isValidUsername = (username: string) => {
  return (/^[a-zA-Z0-9]+$/.test(username) && username.length >= USERNAME_MIN_LENGTH && username.length <= USERNAME_MAX_LENGTH);
}

export const isValidPassword = (password: string) => {
  return (/^[a-zA-Z0-9!_#]+$/.test(password) && password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH);
}

export const isValidAmount = (amount: string | number, balance?: string | number) => {
  if (balance) return Number(amount) > 0 && Number.isFinite(Number(amount)) && Number(amount) <= Number(balance);
  return Number(amount) > 0 && Number.isFinite(Number(amount));
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^.+@.+\..+$/;
  return emailRegex.test(email);
};

export const isValidPass = (pass: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
  return regex.test(pass);
};