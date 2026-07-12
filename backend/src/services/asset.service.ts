import {
    getAssetsRepository,
    getAssetByIdRepository,
    createAssetRepository,
    updateAssetRepository,
    deleteAssetRepository,
    getAssetBySerialNumberRepository
} from "../repositories/asset.repository";
import { Asset } from "../types/asset.types";
import AppError from "../utils/AppError";

// here the code fetches the assets 
export const getAssetsService = async () => {
    return await getAssetsRepository();
};

export const getAssetByIdService = async (id: string) => {
    const asset = await getAssetByIdRepository(id);
    if (!asset) {
        throw new AppError("Asset not found", 404);
    }
    return asset;
};

export const createAssetService = async (asset: Asset) => {
    if (!asset.serial_number) {
        throw new AppError("Serial number is required", 400);
    }
    const existing = await getAssetBySerialNumberRepository(asset.serial_number);
    if (existing) {
        throw new AppError("Asset with this serial number already exists", 400);
    }
    return await createAssetRepository(asset);
};

export const updateAssetService = async (id: string, asset: Asset) => {
    const existingAsset = await getAssetByIdRepository(id);
    if (!existingAsset) {
        throw new AppError("Asset not found", 404);
    }

    if (asset.serial_number && asset.serial_number !== existingAsset.serial_number) {
        const existing = await getAssetBySerialNumberRepository(asset.serial_number);
        if (existing) {
            throw new AppError("Asset with this serial number already exists", 400);
        }
    }

    return await updateAssetRepository(id, asset);
};

export const deleteAssetService = async (id: string) => {
    const existingAsset = await getAssetByIdRepository(id);
    if (!existingAsset) {
        throw new AppError("Asset not found", 404);
    }
    return await deleteAssetRepository(id);
};