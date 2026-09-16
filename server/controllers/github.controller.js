import {
  getGithubProfile,
  syncGithubRepositories,
  syncGithubActivity,
  syncGithubProfile,
  updateGithubProfile,
} from "../services/github-service.js";

import { GithubProfile } from "../models/index.js";


/**
 * GET /api/github/profile
 */
export const getProfile = async (
  req,
  res
) => {
  try {
    const profile =
      await getGithubProfile();

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(
      "Get GitHub profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch GitHub profile",
      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * POST /api/github/profile/sync
 */
export const syncProfile = async (
  req,
  res
) => {
  try {
    const profile =
      await syncGithubProfile();

    return res.status(200).json({
      success: true,
      message:
        "GitHub profile synced successfully",
      data: profile,
    });
  } catch (error) {
    console.error(
      "GitHub profile sync error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to sync GitHub profile",
      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * PUT /api/github/profile/:id
 */
export const updateProfile = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const profile =
      await updateGithubProfile(
        id,
        req.body
      );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error(
      "Update GitHub profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update GitHub profile",
      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * Sync GitHub repositories
 */
export const syncRepositories = async (req, res) => {
  try {
    const result = await syncGithubRepositories();

    return res.status(200).json({
      success: true,
      message: "GitHub repositories synced successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "GitHub repository sync error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to sync GitHub repositories",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * Sync GitHub activity
 */
export const syncActivity = async (req, res) => {
  try {
    const result = await syncGithubActivity();

    return res.status(200).json({
      success: true,
      message: "GitHub activity synced successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "GitHub activity sync error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to sync GitHub activity",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


/**
 * Delete GitHub profile
 */
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await GithubProfile.findByPk(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    await profile.destroy();

    return res.status(200).json({
      success: true,
      message: "GitHub profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete GitHub profile",
    });
  }
};