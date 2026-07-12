-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "assets" (
    "asset_id" SERIAL NOT NULL,
    "asset_tag" TEXT,
    "name" TEXT NOT NULL,
    "category_id" INTEGER,
    "serial_number" TEXT NOT NULL,
    "acquisition_cost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "acquisition_date" TIMESTAMP(3),
    "current_status" TEXT NOT NULL DEFAULT 'Available',
    "description" TEXT,
    "location" TEXT,
    "assigned_to_id" INTEGER,
    "purchase_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "maintenances" (
    "maintenance_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "issue_description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("maintenance_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "assets_serial_number_key" ON "assets"("serial_number");

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("asset_id") ON DELETE CASCADE ON UPDATE CASCADE;
