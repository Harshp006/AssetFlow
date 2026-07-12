import { body } from "express-validator";

export const createMaintenanceValidator = [
  body("assetId")
    .isInt({ min: 1 })
    .withMessage("Asset ID must be a positive integer"),

  body("issue")
    .trim()
    .notEmpty()
    .withMessage("Issue description is required")
    .isLength({ min: 5 })
    .withMessage("Issue description must be at least 5 characters long"),

  body("priority")
    .trim()
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["LOW", "MEDIUM", "HIGH", "low", "medium", "high"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),
];

export const updateMaintenanceValidator = [
  body("assetId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Asset ID must be a positive integer"),

  body("issue")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Issue description must be at least 5 characters long"),

  body("priority")
    .optional()
    .trim()
    .isIn(["LOW", "MEDIUM", "HIGH", "low", "medium", "high"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),

  body("status")
    .optional()
    .trim()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED", "RESOLVED", "CANCELLED", "pending", "in_progress", "completed", "resolved", "cancelled"])
    .withMessage("Invalid maintenance status"),
];
