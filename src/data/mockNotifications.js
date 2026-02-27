export const mockNotifications = [
  { id: 1, read: false, type: "position", title: "You are now 3rd in line", message: "Your position in the Enrollment queue has updated. Estimated wait: 12 minutes.", service: "Enrollment", time: "2 min ago" },
  { id: 2, read: false, type: "position", title: "You are next!", message: "Proceed to Window #2 for your Enrollment transaction. You have 5 minutes.", service: "Enrollment", time: "8 min ago" },
  { id: 3, read: false, type: "complete", title: "Queue EN-008 Completed", message: "Your Enrollment transaction was completed successfully. Thank you!", service: "Enrollment", time: "45 min ago" },
  { id: 4, read: true, type: "warning", title: "Missed Your Turn — EN-006", message: "You did not arrive within the grace period. Your queue EN-006 was cancelled.", service: "Enrollment", time: "Yesterday 2:15 PM" },
  { id: 5, read: true, type: "position", title: "You are now 5th in line", message: "Your position in the Clearance queue has updated.", service: "Clearance", time: "Yesterday 10:30 AM" },
  { id: 6, read: true, type: "complete", title: "Queue CL-004 Completed", message: "Your Clearance transaction was completed. Have a great day!", service: "Clearance", time: "Yesterday 11:05 AM" },
  { id: 7, read: true, type: "system", title: "INC Processing Closed for Today", message: "The INC Processing service has reached its daily cut-off. Unserved students will receive priority numbers tomorrow.", service: "System", time: "Feb 25, 5:00 PM" },
  { id: 8, read: true, type: "warning", title: "Queue Paused — Enrollment", message: "The Enrollment queue has been temporarily paused. Please wait for further updates.", service: "Enrollment", time: "Feb 25, 1:42 PM" },
  { id: 9, read: true, type: "system", title: "Priority Queue Assigned", message: "You have been assigned a priority queue number EN-P003 for tomorrow due to today's cut-off. You will be served first.", service: "System", time: "Feb 25, 5:01 PM" },
  { id: 10, read: true, type: "cancel", title: "Queue TR-002 Cancelled", message: "Your Transcript Request queue was cancelled as requested.", service: "Transcript", time: "Feb 24, 3:20 PM" },
];
