import {
  getGithubProfile,
  syncGithubRepositories,
  syncGithubActivity,
  syncGithubProfile,
  updateGithubProfile,
  deleteGithubProfile,
} from "../services/github-service.js";

import { respondToGithubError } from "../services/github-api.js";


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
    return respondToGithubError(
      res,
      error,
      "Failed to fetch GitHub profile"
    );
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
    return respondToGithubError(
      res,
      error,
      "Failed to sync GitHub profile"
    );
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
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid profile ID is required",
      });
    }
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "A valid profile object is required",
      });
    }

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
      "Update GitHub profile failed:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({
      success: false,
      message: "Failed to update GitHub profile",
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
    return respondToGithubError(
      res,
      error,
      "Failed to sync GitHub repositories"
    );
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
    return respondToGithubError(
      res,
      error,
      "Failed to sync GitHub activity"
    );
  }
};


/**
 * Delete GitHub profile
 */
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid profile ID is required",
      });
    }

    const deleted = await deleteGithubProfile(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "GitHub profile deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete GitHub profile failed:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({
      success: false,
      message: "Failed to delete GitHub profile",
    });
  }
};