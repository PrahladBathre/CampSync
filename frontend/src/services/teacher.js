import axios from "axios";

// Get all teachers
export const getAllTeachers = async () => {
  const response = await axios.get("/api/teacher", { withCredentials: true });
  const records = response?.data?.data ?? response?.data;
  if (!Array.isArray(records)) throw new Error("The teacher API returned an unexpected response.");
  return records;
};
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

// Register a teacher with the exact multipart field expected by the upload middleware.
export const registerTeacher = async (formData, file) => {
  if (!formData) throw new Error("Registration data is required.");
  const teacher = {
    ...formData,
    teacherFullName: formData.teacherFullName?.trim(),
    teacherEmail: formData.teacherEmail?.trim().toLowerCase(),
    teacherUsername: formData.teacherUsername?.trim().toLowerCase(),
    teacherId: formData.teacherId?.trim(),
    teacherContactInfo: formData.teacherContactInfo?.trim(),
  };
  const payload = new FormData();
  Object.entries(teacher).forEach(([key, value]) => {
    if (value !== undefined && value !== null) payload.append(key, String(value));
  });
  if (file) payload.append("teacherAvatar", file);
  return axios.post("/api/teacher/register", payload, { withCredentials: true });
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
  try {
    return await axios.post("/api/teacher/logout", {}, { withCredentials: true });
  } finally {
    try { sessionStorage.removeItem("campSyncAccessToken"); } catch {}
  }
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
  const passChange = await axios
    .patch("/api/teacher/change-password", password, {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => {
      res.data;
    });
  return passChange;
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
  const teacher = {
    teacherFullName: updateData?.teacherFullName?.trim(),
    teacherEmail: updateData?.teacherEmail?.trim().toLowerCase(),
    teacherUsername: updateData?.teacherUsername?.trim().toLowerCase(),
    teacherContactInfo: updateData?.teacherContactInfo?.trim(),
  };
  const data = Object.fromEntries(Object.entries(teacher).filter(([, value]) => value !== undefined && value !== ""));
  return axios.patch("/api/teacher/update-details", data, { withCredentials: true });
};

// Update teacher avatar
export const updateTeacherAvatar = async (avatarPic) => {
  const picture = {
    ...avatarPic,
    teacherAvatar: avatarPic?.teacherAvatar,
  };
  const update = await axios
    .patch(
      "/api/teacher/update-avatar",
      picture,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
      {
        withCredentials: true, // ✅ Important for cookies/session
      }
    )
    .then((res) => {
      res.data;
    });
  return update;
};

export const resendVerificationCode = async (teacherEmail) => {
  console.log("resendVerificationCode service teacherEmail", teacherEmail);
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
