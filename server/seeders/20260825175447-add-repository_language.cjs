"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("repository_languages", [
      {
        repository_id: 1,
        language: "JavaScript",
        bytes: 245000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        repository_id: 1,
        language: "TypeScript",
        bytes: 180000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        repository_id: 1,
        language: "CSS",
        bytes: 95000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        repository_id: 2,
        language: "JavaScript",
        bytes: 320000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        repository_id: 2,
        language: "HTML",
        bytes: 75000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        repository_id: 2,
        language: "CSS",
        bytes: 125000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        repository_id: 3,
        language: "TypeScript",
        bytes: 410000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        repository_id: 3,
        language: "JavaScript",
        bytes: 150000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("repository_languages", null, {});
  },
};