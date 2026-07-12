import {

    getAssetsRepository,

    getAssetByIdRepository,

    createAssetRepository,

    updateAssetRepository,

    deleteAssetRepository

} from "../repositories/asset.repository";
import { Asset } from "../types/asset.types";
// here the code ftches the assets 
export const getAssetsService = async () => {

    return await getAssetsRepository();

};

export const getAssetByIdService = async (
    id: string
) => {

    return await getAssetByIdRepository(id);

};

export const createAssetService = async (
    asset: Asset
) => {

    return await createAssetRepository(asset);

};

export const updateAssetService = async (
    id: string,
    asset: Asset
) => {

    return await updateAssetRepository(id, asset);

};

export const deleteAssetService = async (
    id: string
) => {

    return await deleteAssetRepository(id);

};