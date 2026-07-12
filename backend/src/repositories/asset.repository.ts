import prisma from "../utils/prisma";

const mapToAssetType = (dbAsset: any): any => {
  return {
    asset_id: dbAsset.id,
    asset_tag: dbAsset.assetTag,
    name: dbAsset.name,
    category_id: dbAsset.categoryId,
    serial_number: dbAsset.serialNumber,
    acquisition_cost: dbAsset.acquisitionCost,
    acquisition_date: dbAsset.acquisitionDate ? dbAsset.acquisitionDate.toISOString().split('T')[0] : undefined,
    current_status: dbAsset.status,
  };
};

export const getAssetsRepository = async () => {
  const dbAssets = await prisma.asset.findMany({
    orderBy: { id: "asc" },
  });
  return dbAssets.map(mapToAssetType);
};

export const getAssetByIdRepository = async (id: string) => {
  const assetId = parseInt(id, 10);
  if (isNaN(assetId)) return null;

  const dbAsset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!dbAsset) return null;
  return mapToAssetType(dbAsset);
};

export const createAssetRepository = async (asset: any) => {
  const dbAsset = await prisma.asset.create({
    data: {
      name: asset.name,
      categoryId: asset.category_id ? Number(asset.category_id) : null,
      serialNumber: asset.serial_number,
      acquisitionCost: asset.acquisition_cost ? Number(asset.acquisition_cost) : 0,
      acquisitionDate: asset.acquisition_date ? new Date(asset.acquisition_date) : null,
      status: asset.current_status || "Available",
      assetTag: asset.asset_tag || null,
    },
  });

  return mapToAssetType(dbAsset);
};

export const updateAssetRepository = async (id: string, asset: any) => {
  const assetId = parseInt(id, 10);
  if (isNaN(assetId)) throw new Error("Invalid asset ID");

  const updateData: any = {};
  if (asset.name !== undefined) updateData.name = asset.name;
  if (asset.category_id !== undefined) updateData.categoryId = asset.category_id ? Number(asset.category_id) : null;
  if (asset.serial_number !== undefined) updateData.serialNumber = asset.serial_number;
  if (asset.acquisition_cost !== undefined) updateData.acquisitionCost = asset.acquisition_cost ? Number(asset.acquisition_cost) : undefined;
  if (asset.acquisition_date !== undefined) updateData.acquisitionDate = asset.acquisition_date ? new Date(asset.acquisition_date) : null;
  if (asset.current_status !== undefined) updateData.status = asset.current_status;
  if (asset.asset_tag !== undefined) updateData.assetTag = asset.asset_tag;

  const dbAsset = await prisma.asset.update({
    where: { id: assetId },
    data: updateData,
  });

  return mapToAssetType(dbAsset);
};

export const deleteAssetRepository = async (id: string) => {
  const assetId = parseInt(id, 10);
  if (isNaN(assetId)) throw new Error("Invalid asset ID");

  const dbAsset = await prisma.asset.delete({
    where: { id: assetId },
  });

  return mapToAssetType(dbAsset);
};