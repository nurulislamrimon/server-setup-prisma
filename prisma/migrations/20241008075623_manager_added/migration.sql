-- AlterTable
ALTER TABLE `administrator` MODIFY `role` ENUM('user', 'manager', 'admin', 'super_admin') NOT NULL DEFAULT 'user';
