ALTER TABLE `privacy_requests` MODIFY COLUMN `requesterEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `privacy_requests` MODIFY COLUMN `requesterFirstName` varchar(100);--> statement-breakpoint
ALTER TABLE `privacy_requests` MODIFY COLUMN `requesterLastName` varchar(100);--> statement-breakpoint
ALTER TABLE `privacy_requests` ADD `source` varchar(32) DEFAULT 'privacy_request' NOT NULL;