"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "repository_languages",
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        repository_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,

          references: {
            model: "repositories",
            key: "id",
          },

          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        language: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },

        bytes: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
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
      }
    );

    // Index for faster repository lookups
    await queryInterface.addIndex(
      "repository_languages",
      ["repository_id"],
      {
        name: "idx_repository_languages_repository_id",
      }
    );

    // Index for language filtering
    await queryInterface.addIndex(
      "repository_languages",
      ["language"],
      {
        name: "idx_repository_languages_language",
      }
    );

    // Prevent duplicate languages for the same repository
    await queryInterface.addConstraint(
      "repository_languages",
      {
        fields: [
          "repository_id",
          "language",
        ],

        type: "unique",

        name: "unique_repository_language",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "repository_languages"
    );
  },
};