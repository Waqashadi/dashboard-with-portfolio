"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("activities", [
      {
        github_id: "event_10001",
        type: "PushEvent",
        repository_id: 1,
        title: "Pushed new changes",
        description: "Added new dashboard components and improved API integration.",
        url: "https://github.com/Waqashadi/github-dashboard/commit/abc123",
        occurred_at: new Date("2026-08-20T10:30:00Z"),
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        github_id: "event_10002",
        type: "PullRequestEvent",
        repository_id: 1,
        title: "Opened pull request",
        description: "Added GitHub contribution statistics.",
        url: "https://github.com/Waqashadi/github-dashboard/pull/12",
        occurred_at: new Date("2026-08-21T14:20:00Z"),
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        github_id: "event_10003",
        type: "IssuesEvent",
        repository_id: 2,
        title: "Created new issue",
        description: "Reported an issue with repository statistics.",
        url: "https://github.com/Waqashadi/project-two/issues/5",
        occurred_at: new Date("2026-08-22T09:15:00Z"),
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        github_id: "event_10004",
        type: "CreateEvent",
        repository_id: 2,
        title: "Created repository",
        description: "Created a new GitHub repository.",
        url: "https://github.com/Waqashadi/project-two",
        occurred_at: new Date("2026-08-22T16:00:00Z"),
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        github_id: "event_10005",
        type: "WatchEvent",
        repository_id: 3,
        title: "Repository starred",
        description: "Repository received a new star.",
        url: "https://github.com/Waqashadi/project-three",
        occurred_at: new Date("2026-08-23T11:45:00Z"),
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        github_id: "event_10006",
        type: "ForkEvent",
        repository_id: 3,
        title: "Repository forked",
        description: "Repository was forked by another developer.",
        url: "https://github.com/Waqashadi/project-three",
        occurred_at: new Date("2026-08-24T13:10:00Z"),
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        github_id: "event_10007",
        type: "ReleaseEvent",
        repository_id: null,
        title: "Published a release",
        description: "Published a new project release.",
        url: "https://github.com/Waqashadi",
        occurred_at: new Date("2026-08-24T18:30:00Z"),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("activities", null, {});
  },
};