import { Attendance } from "../models/attendence.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addAttendance = asyncHandler(async (req, res) => {
  console.log("inside controller", req.body);

  const { attendanceStudent, attendanceCourse, attendanceSemester } = req.body;
  if (!attendanceStudent || !attendanceCourse || !attendanceSemester) {
    throw new ApiError(400, "Student, Course, and Semester are required");
  }

  const register = await Attendance.create({
    attendanceStudent: attendanceStudent,
    attendanceCourse: attendanceCourse,
    attendanceSemester: attendanceSemester,
    attendanceStatus: "Absent", //modify in update
    attendanceRecordedBy: null, //modify in update
    attendanceSubject: null, //modify in update
    attendanceDate: null, //modify in update
  });
  console.log("verify attendance", register);

  const verify = await Attendance.findOne({ _id: register._id });

  if (!verify) {
    throw new ApiError(500, "Failed to create attendance record");
  }
  return res
    .status(200)
    .json(
      new Apiresponse(201, verify, "Attendance record created successfully")
    );
});

const ModifyAttendance = asyncHandler(async (req, res) => {
  const { _id, attendanceRecordedBy, attendanceStatus } = req.body;

  if (!_id) {
    throw new ApiError(400, "Attendance ID is required");
  }

  const modify = await Attendance.findByIdAndUpdate(
    _id,
    {
      attendanceRecordedBy,
      attendanceStatus,
    },
    { new: true } // Return the updated document
  );

  if (!modify) {
    throw new ApiError(404, "Attendance record not found");
  }

  return res
    .status(200)
    .json(new Apiresponse(200, modify, "Attendance updated successfully"));
});

const getStudentsByCourseAndSemesterAndSubject = asyncHandler(
  async (req, res) => {
    const {
      attendanceCourse,
      attendanceSubject,
      attendanceSemester,
      attendanceDate,
    } = req.body;

    // Build dynamic filter
    const queryFilter = {};
    if (attendanceCourse) queryFilter.attendanceCourse = attendanceCourse;
    if (attendanceSubject) queryFilter.attendanceSubject = attendanceSubject;
    if (attendanceSemester) queryFilter.attendanceSemester = attendanceSemester;
    if (attendanceDate) queryFilter.attendanceDate = attendanceDate;

    // Fetch attendance records with relevant student/course/teacher data
    const attendanceRecords = await Attendance.find(queryFilter).populate([
      {
        path: "attendanceRecordedBy",
        select: "_id teacherFullName",
      },
      {
        path: "attendanceSubject",
        select: "_id subjectCode",
      },
      {
        path: "attendanceCourse",
        select: "_id courseCode",
      },
    ]);

    if (!attendanceRecords || attendanceRecords.length === 0) {
      throw new ApiError(
        404,
        "No attendance records found for the given filters."
      );
    }

    return res
      .status(200)
      .json(
        new Apiresponse(
          200,
          attendanceRecords,
          "Attendance records fetched successfully."
        )
      );
  }
);
const attendanceCount = asyncHandler(async (req, res) => {
  const [statusCounts, dailyTrend, totalRecords] = await Promise.all([
    Attendance.aggregate([
      { $group: { _id: "$attendanceStatus", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Attendance.aggregate([
      { $match: { attendanceDate: { $type: "date" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$attendanceDate" } },
          present: { $sum: { $cond: [{ $eq: ["$attendanceStatus", "Present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$attendanceStatus", "Absent"] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ["$attendanceStatus", "Late"] }, 1, 0] } },
          excused: { $sum: { $cond: [{ $eq: ["$attendanceStatus", "Excused"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 90 },
    ]),
    Attendance.countDocuments(),
  ]);

  return res.status(200).json(new Apiresponse(200, {
    totalRecords,
    statusCounts: statusCounts.map(({ _id, count }) => ({ status: _id || "Unspecified", count })),
    dailyTrend: dailyTrend.map(({ _id, ...values }) => ({ date: _id, ...values })),
    datedRecords: dailyTrend.reduce((sum, day) => sum + day.total, 0),
  }, "Attendance insights fetched successfully"));
});
const removeStudentAttendance = asyncHandler(async (req, res) => {});
export {
  addAttendance,
  ModifyAttendance,
  getStudentsByCourseAndSemesterAndSubject,
  attendanceCount,
  removeStudentAttendance,
};
