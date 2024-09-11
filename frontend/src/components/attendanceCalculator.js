export const calculateSubjectAttendancePercentage = (presentCount, totalSessions) => {
    if (totalSessions === 0) {
        return 0;
    }
    const percentage = (presentCount / totalSessions) * 100;
    return parseFloat(percentage.toFixed(2)); // Limit to two decimal places and return as a number
};

export const groupAttendanceBySubject = (subjectAttendance) => {
    const attendanceBySubject = {};

    subjectAttendance.forEach(({ subName, status, date }) => {
        const { _id: subId, subName: subjectName, sessions } = subName;

        if (!attendanceBySubject[subjectName]) {
            attendanceBySubject[subjectName] = {
                present: 0,
                absent: 0,
                sessions: parseInt(sessions, 10),
                allData: [],
                subId,
            };
        }

        if (status === "Present") {
            attendanceBySubject[subjectName].present++;
        } else if (status === "Absent") {
            attendanceBySubject[subjectName].absent++;
        }

        attendanceBySubject[subjectName].allData.push({ date, status });
    });

    return attendanceBySubject;
};

export const calculateOverallAttendancePercentage = (subjectAttendance) => {
    let totalSessionsSum = 0;
    let presentCountSum = 0;
    const countedSubIds = new Set();

    subjectAttendance.forEach(({ subName, status }) => {
        const { _id: subId, sessions } = subName;

        if (!countedSubIds.has(subId)) {
            totalSessionsSum += parseInt(sessions, 10);
            countedSubIds.add(subId);
        }

        if (status === "Present") {
            presentCountSum++;
        }
    });

    if (totalSessionsSum === 0) {
        return 0;
    }

    return parseFloat(((presentCountSum / totalSessionsSum) * 100).toFixed(2));
};
