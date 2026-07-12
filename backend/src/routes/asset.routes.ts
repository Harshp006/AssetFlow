import { Router } from "express";

import {
    getAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
} from "../controllers/asset.controller";

import validationMiddleware from "../middlewares/validation.middleware";

import {
    createAssetValidator
} from "../validators/asset.validator";

const router = Router();

router.get("/", getAssets);

router.get("/:id", getAssetById);

router.post(
    "/",
    createAssetValidator,
    validationMiddleware,
    createAsset
);

router.put("/:id", createAsset);

router.delete("/:id", deleteAsset);

export default router;