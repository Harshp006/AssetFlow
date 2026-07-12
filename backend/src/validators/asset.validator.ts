import { body } from "express-validator";

export const createAssetValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Asset name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Asset name should be between 3 and 100 characters"),

    body("category_id")
        .isInt({ min: 1 })
        .withMessage("Category ID must be a positive integer"),

    body("serial_number")
        .trim()
        .notEmpty()
        .withMessage("Serial Number is required"),

    body("acquisition_cost")
        .isFloat({ min: 0 })
        .withMessage("Invalid acquisition cost"),

    body("current_status")
        .isIn([
            "Available",
            "Allocated",
            "Reserved",
            "Under Maintenance",
            "Lost",
            "Retired",
            "Disposed"
        ])
        .withMessage("Invalid Asset Status")

];