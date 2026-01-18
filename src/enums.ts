export enum ConsoleColor {
    RESET = "\u001b[0m",
    RED = "\u001b[31m",
    YELLOW = "\u001b[33m",
    GREEN = "\u001b[32m"
}

export enum TokenType {
    Auth = "AUTH",
    Access = "ACCESS",
    Recovery = "RECOVERY",
    Deletion = "DELETION"
}

export enum UUIDType {
    User = "USER",
    Auth = "AUTH"
}

export enum EnvType {
    Boolean = "BOOLEAN",
    String = "STRING",
    Number = "NUMBER"
}

export enum NodeEnv {
    Dev = "DEV",
    Testing = "TESTING",
    Production = "PRODUCTION"
}

export enum EMailSender {
    System = "SYSTEM",
    NoReply = "NO-REPLY",
    Support = "SUPPORT"
}

export enum SupportType {
    General = "GENERAL",
    Legal = "LEGAL",
    SystemIssue = "SYSTEM-ISSUE",
    ReportImage = "REPORT-IMAGE",
    SuggestionsForImprovement = "SUGGESTIONS-FOR-IMPROVEMENT",
}
export const supportTypes: [SupportType, ...SupportType[]] = Object.values(SupportType) as [SupportType, ...SupportType[]];

export enum FileType {
    ProfilePicture = "PROFILE-PICTURE"
}
export const fileTypes: [FileType, ...FileType[]] = Object.values(FileType) as [FileType, ...FileType[]];

export enum UserType {
    Student = "STUDENT",
    Company = "COMPANY"
}

export enum JobsSortType {
    Newest = "NEWEST",
    Oldest = "OLDEST",
}
export const jobsSortType: [JobsSortType, ...JobsSortType[]] = Object.values(JobsSortType) as [JobsSortType, ...JobsSortType[]];