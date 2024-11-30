export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export enum IssueStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  UNDER_REVIEW = "UNDER_REVIEW",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
}

export enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum IssueType {
  BUG = "BUG",
  FEATURE = "FEATURE",
  ENHANCEMENT = "ENHANCEMENT",
  TASK = "TASK",
}
