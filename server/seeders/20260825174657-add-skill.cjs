"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("skills", [
      {
        name: "JavaScript",
        level: "Advanced",
        score: 92.50,
        repositories_count: 18,
        total_bytes: 2450000,
        category: "Programming Language",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "TypeScript",
        level: "Intermediate",
        score: 78.50,
        repositories_count: 10,
        total_bytes: 1350000,
        category: "Programming Language",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "React",
        level: "Advanced",
        score: 90.00,
        repositories_count: 15,
        total_bytes: 2100000,
        category: "Frontend",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Next.js",
        level: "Intermediate",
        score: 82.50,
        repositories_count: 8,
        total_bytes: 1250000,
        category: "Frontend",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Node.js",
        level: "Intermediate",
        score: 80.00,
        repositories_count: 9,
        total_bytes: 1800000,
        category: "Backend",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Express.js",
        level: "Intermediate",
        score: 76.50,
        repositories_count: 7,
        total_bytes: 950000,
        category: "Backend",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "MySQL",
        level: "Intermediate",
        score: 74.00,
        repositories_count: 6,
        total_bytes: 620000,
        category: "Database",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Sequelize",
        level: "Intermediate",
        score: 70.50,
        repositories_count: 5,
        total_bytes: 480000,
        category: "ORM",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Tailwind CSS",
        level: "Advanced",
        score: 94.00,
        repositories_count: 20,
        total_bytes: 850000,
        category: "Frontend",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "HTML",
        level: "Advanced",
        score: 95.00,
        repositories_count: 22,
        total_bytes: 720000,
        category: "Frontend",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "CSS",
        level: "Advanced",
        score: 93.50,
        repositories_count: 21,
        total_bytes: 980000,
        category: "Frontend",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Git",
        level: "Advanced",
        score: 88.00,
        repositories_count: 30,
        total_bytes: 350000,
        category: "Tools",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("skills", {
      name: [
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Express.js",
        "MySQL",
        "Sequelize",
        "Tailwind CSS",
        "HTML",
        "CSS",
        "Git",
      ],
    });
  },
};