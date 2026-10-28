export const validInput = (form = {}) => {
  const err = {};
  const required = (key, errorKey, message) => {
    if (!String(form[key] ?? "").trim()) err[errorKey] = message;
  };

  required("teacherFullName", "nameError", "Full name is required");
  required("teacherEmail", "emailError", "Email is required");
  required("teacherUsername", "usernameError", "Username is required");
  required("teacherId", "idError", "Teacher ID is required");
  required("teacherPassword", "passError", "Password is required");
  required("teacherContactInfo", "contactError", "Contact number is required");
  required("teacherGender", "genderError", "Please select a gender");

  if (form.teacherEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.teacherEmail.trim())) {
    err.emailError = "Enter a valid email address";
  }
  if (form.teacherUsername && !/^[a-zA-Z0-9]+$/.test(form.teacherUsername.trim())) {
    err.usernameError = "Use letters and numbers only for your username";
  }
  if (form.teacherId && !/^UICSA[A-Za-z0-9]{0,10}$/.test(form.teacherId.trim())) {
    err.idError = "Teacher ID must start with UICSA";
  }
  if (form.teacherContactInfo && !/^\d{10}$/.test(form.teacherContactInfo.trim())) {
    err.contactError = "Enter a 10-digit contact number";
  }
  if (form.teacherPassword && !/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(form.teacherPassword)) {
    err.passError = "Use at least 6 characters, including an uppercase letter and a number";
  }
  return err;
};
