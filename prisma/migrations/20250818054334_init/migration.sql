-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `oldprice` INTEGER NOT NULL,
    `newprice` INTEGER NOT NULL,
    `offer` BOOLEAN NOT NULL DEFAULT false,
    `moreinfo` VARCHAR(191) NOT NULL,
    `mainimg` VARCHAR(191) NOT NULL,
    `slideimg` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
