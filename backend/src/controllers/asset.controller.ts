import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { successResponse } from "../utils/response";

import {
    getAssetsService,
    getAssetByIdService,
    createAssetService,
    updateAssetService,
    deleteAssetService
} from "../services/asset.service";

export const getAssets = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {

        const assets = await getAssetsService();

        successResponse(res, "Assets fetched successfully", assets, 200);

    }
);

export const getAssetById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const asset = await getAssetByIdService(String(req.params.id));

        successResponse(res, "Asset fetched successfully", asset, 200);

    }
);

export const createAsset = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const asset = await createAssetService(req.body);

        successResponse(res, "Asset created successfully", asset, 201);

    }
);

export const updateAsset = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const asset = await updateAssetService(
            String(req.params.id),
            req.body
        );

        successResponse(res, "Asset updated successfully", asset, 200);

    }
);

export const deleteAsset = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        await deleteAssetService(String(req.params.id));

        successResponse(res, "Asset deleted successfully", null, 200);

    }
);