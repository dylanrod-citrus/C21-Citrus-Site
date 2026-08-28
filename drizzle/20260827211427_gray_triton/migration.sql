CREATE TABLE `privacy_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestType` varchar(32) NOT NULL,
	`requesterEmail` varchar(320) NOT NULL,
	`requesterFirstName` varchar(100) NOT NULL,
	`requesterLastName` varchar(100) NOT NULL,
	`status` enum('received','processing','completed','closed') NOT NULL DEFAULT 'received',
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `privacy_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `privacy_request_requester_email_idx` ON `privacy_requests` (`requesterEmail`);--> statement-breakpoint
CREATE INDEX `privacy_request_status_received_idx` ON `privacy_requests` (`status`,`receivedAt`);