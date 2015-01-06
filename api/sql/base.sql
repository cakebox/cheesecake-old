# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: localhost (MySQL 10.0.15-MariaDB)
# Base de données: colabsubs
# Temps de génération: 2015-01-06 18:20:34 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table movies
# ------------------------------------------------------------

DROP TABLE IF EXISTS `movies`;

CREATE TABLE `movies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `imdb_id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `year` int(4) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table movies_subtitles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `movies_subtitles`;

CREATE TABLE `movies_subtitles` (
  `movie_id` int(11) unsigned NOT NULL,
  `subtitle_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`movie_id`,`subtitle_id`),
  KEY `subtitle_id` (`subtitle_id`),
  CONSTRAINT `movies_subtitles_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  CONSTRAINT `movies_subtitles_ibfk_2` FOREIGN KEY (`subtitle_id`) REFERENCES `subtitles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table subtitles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `subtitles`;

CREATE TABLE `subtitles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `language` varchar(255) NOT NULL,
  `high_definition` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `audio_description` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `tags` varchar(255) DEFAULT '',
  `is_release` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table subtitles_in_progress
# ------------------------------------------------------------

DROP TABLE IF EXISTS `subtitles_in_progress`;

CREATE TABLE `subtitles_in_progress` (
  `subtitle_id` int(11) unsigned NOT NULL,
  `sentence_id` int(11) unsigned NOT NULL,
  `sentence` text,
  `created_by` int(11) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`subtitle_id`,`sentence_id`,`created_by`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `subtitles_in_progress_ibfk_1` FOREIGN KEY (`subtitle_id`) REFERENCES `subtitles` (`id`),
  CONSTRAINT `subtitles_in_progress_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table subtitles_released
# ------------------------------------------------------------

DROP TABLE IF EXISTS `subtitles_released`;

CREATE TABLE `subtitles_released` (
  `subtitle_id` int(11) unsigned NOT NULL,
  `version` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `subtitle` mediumtext,
  PRIMARY KEY (`subtitle_id`),
  CONSTRAINT `subtitles_released_ibfk_1` FOREIGN KEY (`subtitle_id`) REFERENCES `subtitles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `team`;

CREATE TABLE `team` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `website` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table team_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `team_users`;

CREATE TABLE `team_users` (
  `team_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`team_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_users_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`),
  CONSTRAINT `team_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table tvshows
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tvshows`;

CREATE TABLE `tvshows` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tvdb_id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `season` tinyint(3) unsigned NOT NULL,
  `episode` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table tvshows_subtitles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tvshows_subtitles`;

CREATE TABLE `tvshows_subtitles` (
  `tvshow_id` int(11) unsigned NOT NULL,
  `subtitle_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`tvshow_id`,`subtitle_id`),
  KEY `subtitle_id` (`subtitle_id`),
  CONSTRAINT `tvshows_subtitles_ibfk_1` FOREIGN KEY (`tvshow_id`) REFERENCES `tvshows` (`id`),
  CONSTRAINT `tvshows_subtitles_ibfk_2` FOREIGN KEY (`subtitle_id`) REFERENCES `subtitles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL DEFAULT '',
  `age` tinyint(3) unsigned DEFAULT NULL,
  `gender` tinyint(1) unsigned DEFAULT NULL,
  `last_seen` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_ip` varchar(15) NOT NULL DEFAULT '',
  `subscription_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `failed_logins` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `password`, `email`, `age`, `gender`, `last_seen`, `last_ip`, `subscription_date`, `failed_logins`)
VALUES
	(1,'user','$2y$10$AHlCzRePTRmzTKmb.WbZROznKmHGCpnmjErwfs2NngcYHk1lnVqOG','user@user.user',NULL,NULL,'0000-00-00 00:00:00','127.0.0.1','2015-01-02 18:43:59',0),
	(2,'modo','$2y$10$l9IQju8HMi30izZukfkml.ecV/fjLFs5wsEV/gVIiAU.CBfFAh3yK','modo@modo.modo',NULL,NULL,'0000-00-00 00:00:00','127.0.0.1','2015-01-02 18:44:16',0),
	(3,'admin','$2y$10$sf1krqI89gRZQLo6L5E4aeTqaxa3DXCaZFKaBJ3/Xj2NlpfaZAOxq','admin@admin.admin',NULL,NULL,'0000-00-00 00:00:00','127.0.0.1','2015-01-02 18:44:32',0);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table users_access
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_access`;

CREATE TABLE `users_access` (
  `user_id` int(11) unsigned NOT NULL,
  `user_level` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `users_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users_access` WRITE;
/*!40000 ALTER TABLE `users_access` DISABLE KEYS */;

INSERT INTO `users_access` (`user_id`, `user_level`)
VALUES
	(2,1),
	(3,2);

/*!40000 ALTER TABLE `users_access` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table users_avatar
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_avatar`;

CREATE TABLE `users_avatar` (
  `user_id` int(11) unsigned NOT NULL,
  `image` blob NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `added_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `users_avatar_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table users_banned
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_banned`;

CREATE TABLE `users_banned` (
  `user_id` int(11) unsigned NOT NULL,
  `ban_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `by` int(11) unsigned NOT NULL,
  `reason` text NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `by` (`by`),
  CONSTRAINT `users_banned_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `users_banned_ibfk_2` FOREIGN KEY (`by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table users_email_validation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_email_validation`;

CREATE TABLE `users_email_validation` (
  `user_id` int(11) unsigned NOT NULL,
  `pending` tinyint(1) NOT NULL DEFAULT '1',
  `validation_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `users_email_validation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table users_stats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_stats`;

CREATE TABLE `users_stats` (
  `user_id` int(11) unsigned NOT NULL,
  `karma` float unsigned NOT NULL DEFAULT '0',
  `translated_lines` int(11) unsigned NOT NULL DEFAULT '0',
  `uploaded_subs` int(11) unsigned NOT NULL DEFAULT '0',
  `edited_subs` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `users_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
