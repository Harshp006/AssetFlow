export const getAssetsRepository = async () => {

    return [];

};

export const getAssetByIdRepository = async (
    id: string
) => {

    return {
        id
    };

};

export const createAssetRepository = async (
    asset: any
) => {

    return asset;

};

export const updateAssetRepository = async (
    id: string,
    asset: any
) => {

    return {
        id,
        ...asset
    };

};

export const deleteAssetRepository = async (
    id: string
) => {

    return {
        id
    };

};