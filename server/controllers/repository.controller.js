import {
  getRepositories,
  getRepositoryById,
  getRepositoryByName,
  getRepositoryLanguages,
} from "../services/repository-service.js";

const stringQuery = (value) => (typeof value === "string" ? value.trim() : "");

/**
 * Get all repositories
 */
export const getAllRepositories = async (req, res) => {
  try {
    const pageValue = Number(req.query.page);
    const limitValue = Number(req.query.limit);
    const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
    const limit =
      Number.isInteger(limitValue) && limitValue > 0
        ? Math.min(limitValue, 100)
        : 12;

    const result = await getRepositories({
      page,
      limit,
      search: stringQuery(req.query.search),
      language: stringQuery(req.query.language),
      sort: stringQuery(req.query.sort),
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Get repositories failed:",
      error instanceof Error ? error.message : error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repositories",
    });
  }
};

/**
 * Get repository by database ID
 */
export const getRepository = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
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
    console.error(
      "Get repository failed:",
      error instanceof Error ? error.message : error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repository",
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
      "Get repository by name failed:",
      error instanceof Error ? error.message : error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repository",
    });
  }
};

/**
 * Get repository languages
 */
export const getLanguages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
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
      "Get repository languages failed:",
      error instanceof Error ? error.message : error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repository languages",
    });
  }
};