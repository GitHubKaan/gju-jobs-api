export class TestingQueries {
    public static readonly deleteTestingTables = `
        DELETE FROM users_student;
        DELETE FROM users_company;
    `;

    public static readonly checkDBStatus = `
        SELECT version()
    `;
}