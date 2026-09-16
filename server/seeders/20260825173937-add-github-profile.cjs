"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("github_profiles", [
      {
        github_id: 123456789,
        username: "Waqashadi",
        name: "Muhammad Waqas",
        bio: "Frontend Web Developer passionate about React, Next.js and modern web technologies.",
        avatar_url: "https://avatars.githubusercontent.com/u/123456789",
        profile_url: "https://github.com/Waqashadi",
        company: "TechnoBlick",
        location: "Lahore, Pakistan",
        email: "waqashadi075@gmail.com",
        public_repositories: 5,
        followers: 120,
        following: 80,
        public_gists: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("github_profiles", {
      username: "Waqashadi",
    });
  },
};