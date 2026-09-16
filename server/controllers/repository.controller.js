import {
  getRepositories,
  getRepositoryById,
  getRepositoryByName,
  getRepositoryLanguages,
  syncRepositories,
} from "../services/repository-service.js";

/**
 * Get all repositories
 */
export const getAllRepositories = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 12,
      search = "",
      language = "",
      sort = "updated",
    } = req.query;

    // Validate pagination
    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(
      Math.max(Number(limit) || 12, 1),
      100
    );

    const result = await getRepositories({
      page,
      limit,
      search: search.trim(),
      language: language.trim(),
      sort,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get repositories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repositories",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * Get repository by database ID
 */
export const getRepository = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Repository ID is required",
      });
    }

    const repository = await getRepositoryById(id);

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: repository,
    });
  } catch (error) {
    console.error("Get repository error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repository",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * Get repository by GitHub repository name
 */
export const getRepositoryByRepoName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Repository name is required",
      });
    }

    const repository = await getRepositoryByName(
      name
    );

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: repository,
    });
  } catch (error) {
    console.error(
      "Get repository by name error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repository",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * Get repository languages
 */
export const getLanguages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Repository ID is required",
      });
    }

    const languages = await getRepositoryLanguages(id);

    return res.status(200).json({
      success: true,
      data: languages,
    });
  } catch (error) {
    console.error(
      "Get repository languages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repository languages",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * Sync repositories from GitHub
 */
export const syncRepositoryData = async (req, res) => {
  try {
    const result = await syncRepositories();

    return res.status(200).json({
      success: true,
      message: "Repositories synced successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "Repository sync error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to sync repositories",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};