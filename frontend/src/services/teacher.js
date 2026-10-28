import axios from "axios";

// Get all teachers
export const getAllTeachers = async () =>
  await axios
    .get("/api/teacher", {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((dataset) => dataset.data.data)
    .then((res) => res);

// Get teacher count
export const getTeacherCount = async () => {
  return await axios
    .get("/api/teacher/count", {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);
};

// Get teacher by ID
export const getTeacherById = async (teacherId) => {
  const getTeacher = await axios
    .get(`/api/teacher/${teacherId}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data);
  return getTeacher;
};

// Register a new teacher (with avatar upload)
export const registerTeacher = async (formData, file) => {
  if (!formData) {
    return "user register data is empty";
  }

  const payload = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) payload.append(key, value);
  });
  if (file) payload.append("teacherAvatar", file);
  return axios.post("/api/teacher/register", payload, {
    withCredentials: true,
  });
};

// Login teacher
export const loginTeacher = async (teacher) => {
  const login = await axios.post("/api/teacher/login", teacher, {
    withCredentials: true,
  });
  return login;
};
// Logout teacher
export const logoutTeacher = async () => {
  const logout = await axios.post("/api/teacher/logout", {}, {
    withCredentials: true,
  });
  return logout;
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  const refresh = await axios
    .post(
      "/api/teacher/refresh-token",
      { refreshToken },
      {
        withCredentials: true, // ✅ Important for cookies/session
      }
    )
    .then((res) => res.data);
  return refresh;
};

// Change password
export const changePassword = async (passwordData) => {
  const password = {
    ...passwordData,
    oldPassword: passwordData?.oldPassword,
    newPassword: passwordData?.newPassword,
  };
  const response = await axios.patch("/api/teacher/change-password", password, {
    withCredentials: true,
  });
  return response.data;
};

// Get current authenticated teacher
export const getCurrentTeacher = async () => {
  const current = await axios
    .get("/api/teacher/user", { withCredentials: true })
    .then((res) => res.data.data);
  return current;
};

// Update teacher details

export const updateTeacherDetails = async (updateData) => {
  const {
    teacherFullName,
    teacherEmail,
    teacherUsername,
    teacherContactInfo,
    teacherGender,
  } = updateData || {};
  const data = { teacherFullName, teacherEmail, teacherUsername, teacherContactInfo, teacherGender };
  Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
  const update = await axios
    .patch("/api/teacher/update-details", data, { withCredentials: true })
    .then((res) => res.data);
  return update;
};

// Update teacher avatar
export const updateTeacherAvatar = async (avatarPic) => {
  const picture = {
    ...avatarPic,
    teacherAvatar: avatarPic?.teacherAvatar,
  };
  const payload = new FormData();
  if (picture.teacherAvatar) payload.append("avatar", picture.teacherAvatar);
  const response = await axios.patch("/api/teacher/update-avatar", payload, {
    withCredentials: true,
  });
  return response.data;
};

export const resendVerificationCode = async (teacherEmail) => {
  const sendCode = await axios.post(
    "/api/teacher/resend-code",
    { teacherEmail: teacherEmail },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return sendCode;
};

export const verificationUserByEmail = async (email, code) => {
  const teacher = {
    teacherEmail: email,
    emailCode: code,
  };
  const verifyUser = await axios.post("/api/teacher/verifyTeacher", teacher);
  return verifyUser;
};
