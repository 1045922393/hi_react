export const validatePurity = (p) => {
  const reg = new RegExp(/^[01]{3}$/);
  return p && reg.test(p);
}