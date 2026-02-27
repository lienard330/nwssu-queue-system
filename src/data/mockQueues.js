export const mockQueueHistory = [
  { date: "Feb 26, 2026", service: "Enrollment", queueNum: "EN-010", status: "In Queue", waitTime: "—" },
  { date: "Feb 26, 2026", service: "Enrollment", queueNum: "EN-008", status: "Completed", waitTime: "18min" },
  { date: "Feb 25, 2026", service: "Clearance", queueNum: "CL-004", status: "Completed", waitTime: "22min" },
  { date: "Feb 25, 2026", service: "Enrollment", queueNum: "EN-006", status: "No-Show", waitTime: "—" },
  { date: "Feb 24, 2026", service: "Transcript Request", queueNum: "TR-002", status: "Cancelled", waitTime: "—" },
  { date: "Feb 23, 2026", service: "Clearance", queueNum: "CL-001", status: "Completed", waitTime: "31min" },
  { date: "Feb 22, 2026", service: "Enrollment", queueNum: "EN-003", status: "Completed", waitTime: "14min" },
];

// EN queue - serving and waiting
export const enrollmentServing = [
  { windowId: 1, windowName: "Window #1", queueNum: "EN-012", staff: "A. Cruz", student: "Pending" },
  { windowId: 2, windowName: "Window #2", queueNum: "EN-010", staff: "M. Lopez", student: "Cruz, Juan (2023-12345)" },
];

export const enrollmentWaiting = [
  { pos: 1, num: "EN-013", student: "Reyes, Ana Marie", id: "2023-12347", course: "BSBA", year: "2nd Year", waitTime: 18, joinedAt: "11:21 PM" },
  { pos: 2, num: "EN-014", student: "Lopez, Ben", id: "2023-12348", course: "BSED", year: "4th Year", waitTime: 15, joinedAt: "11:24 PM" },
  { pos: 3, num: "EN-015", student: "Garcia, Tom", id: "2023-12349", course: "BSIT", year: "1st Year", waitTime: 11, joinedAt: "11:28 PM" },
];

// CL queue
export const clearanceServing = [
  { windowId: 4, windowName: "Window #4", queueNum: "CL-008", staff: "R. Santos", student: "On Break" },
];

export const clearanceWaiting = [
  { pos: 1, num: "CL-009", student: "Lopez, Ben", id: "2023-12348", course: "BSED", year: "4th Year", waitTime: 12, joinedAt: "11:30 PM" },
];
