-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userid` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `adress` VARCHAR(191) NOT NULL,
    `totalprice` INTEGER NOT NULL,
    `locationid` VARCHAR(191) NULL,

    UNIQUE INDEX `Order_locationid_key`(`locationid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `longitude` INTEGER NOT NULL,
    `latitude` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_locationid_fkey` FOREIGN KEY (`locationid`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
