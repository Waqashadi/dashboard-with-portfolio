"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activities", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      github_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      repository_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,

        references: {
          model: "repositories",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      occurred_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP"
        ),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP"
        ),
      },
    });

    // Repository lookup
    await queryInterface.addIndex(
      "activities",
      ["repository_id"],
      {
        name: "idx_activities_repository_id",
      }
    );

    // Activity timeline
    await queryInterface.addIndex(
      "activities",
      ["occurred_at"],
      {
        name: "idx_activities_occurred_at",
      }
    );

    // Activity type filtering
    await queryInterface.addIndex(
      "activities",
      ["type"],
      {
        name: "idx_activities_type",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("activities");
  },
};