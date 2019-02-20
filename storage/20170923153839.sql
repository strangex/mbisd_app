-- MySQL dump 10.13  Distrib 5.7.19, for Linux (x86_64)
--
-- Host: localhost    Database: mbisd_base
-- ------------------------------------------------------
-- Server version	5.7.19-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `text` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1500842677421 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1500840877426,'2017-07-05 11:00:00','2017-07-05 11:05:00','New event','2017-07-23 19:18:31','2017-07-23 19:18:31'),(1500842677420,'2017-07-13 11:00:00','2017-07-13 11:05:00','modified','2017-07-23 19:45:03','2017-07-23 19:45:12');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidates` (
  `user_id` int(10) unsigned NOT NULL,
  `avatar` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `cin` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `cne` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `birth_date` date NOT NULL,
  `gender` tinyint(4) NOT NULL,
  `gsm` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `address` text COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `infos` varchar(251) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bac_date` date NOT NULL,
  `bac_type` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `bac_note` double(4,2) NOT NULL,
  `bac2_type` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `bac2_university` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `bac2_establishment` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `bac2_date` date NOT NULL,
  `bac2_note1` double(4,2) NOT NULL,
  `bac2_note2` double(4,2) NOT NULL,
  `bac2_note3` double(4,2) NOT NULL,
  `bac2_note4` double(4,2) NOT NULL,
  `bac2_note` double(4,2) NOT NULL,
  `bac2_option` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `bac3_type` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `bac3_university` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `bac3_establishment` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `bac3_date` date NOT NULL,
  `bac3_note1` double(4,2) NOT NULL,
  `bac3_note2` double(4,2) NOT NULL,
  `bac3_note` double(4,2) NOT NULL,
  `bac3_option` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `score` double(8,2) DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `candidates_cin_unique` (`cin`),
  UNIQUE KEY `candidates_cne_unique` (`cne`),
  CONSTRAINT `candidates_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (2,'137QHDAsoGBTKU2slLLhCDTm8u5csRMn3rpiFCB0.jpeg','eyJpdiI6ImpNM05pTFYwTHhGaDNwU01JY0hpSGc9PSIsInZhbHVlIjoiNzFuT2kwZXNwTU96ek5Bcmk3UW1MZz09IiwibWFjIjoiNzJhNjBlMGYzMTIzOWFkNzBjZjI4ZWQxNmViZjk4MzE3ZjlhZWJlMTNlODMxZTAwYTRkZmNkODQyNmM3ZDE3YyJ9','eyJpdiI6IkF0YVwvbGJIdHdCalhUaGJFTHpVemxnPT0iLCJ2YWx1ZSI6ImUrajVhRjRtbjJhRm5TeFBRQ3A3aGN5MEtJTjg2eUVoZkxGaWttXC9paHFjPSIsIm1hYyI6ImVmYWE1Y2UzNTBmZmZkNjAzNzM2OTM3OGY4Zjk1MzZhM2RiMDdjNjU3NjI2NDJkNjk0NjJhZDI2NzQ4ODM0NWUifQ==','eyJpdiI6IklQZ0RZdnh5cDNPVElvY0pXTW5iUkE9PSIsInZhbHVlIjoiVldzRm9VQk1iZTNaTzRpb3hpZ09GUT09IiwibWFjIjoiMGZhNzliMjQ5NTM2NzcyOTJjMDAwY2U0MjBiMDIzNjA4MmExY2JhMzVkZjY5ZmFhNzNhMmRlOWI4MGMyZTRkOCJ9','eyJpdiI6InNIZUJmcHNTSFI3UUIrSDFSY1QzdkE9PSIsInZhbHVlIjoiZm9rb1BiZ0JTenBiRkhVeGk0ZDVGdz09IiwibWFjIjoiNjNkNzQ4NDAzNmQzOTJmYjdhY2FlMTNkODI2ZTBkZDhiOWI0MTMxYTIxZTI5NmMzZjEyOTZhYjFjNTA5MWIzZCJ9','1996-12-03',1,'eyJpdiI6Im1oeENLUG5majQ0MllJUWFZeW85MUE9PSIsInZhbHVlIjoiTFdIN1dTcUFFTFhNekV1UElIdDRySzFpUFJ2ckc5aGgzK1E2bFpBYXhzST0iLCJtYWMiOiJjN2VjYWIyMWRjMzU5MzQzY2U2MzMyYmFhZTAwZDYzMGFlYTA0MWRlZWI5ZWZjMzY0MGEyN2Y3M2JjYzIxZDI1In0=','eyJpdiI6ImN1XC9aaGFObHFaY2tCazJnbFwvOER2Zz09IiwidmFsdWUiOiJUdHQyc1J6Q0JRVEdSRUZjZzlyb3ljdWJtUkZPMWVrXC9VSWZRK2dITjRrND0iLCJtYWMiOiJlZmEwYTcwNWVhZGU1NDA0MzExNzVlMDc4ODI4OTg3Y2FjYjY3YjhjNTljZmUyNDgwZGZlYTE3OGExNTM3NTFkIn0=','eyJpdiI6IjY3aGZJTEJweityZW9CWG1EdEFkVmc9PSIsInZhbHVlIjoiSFF6OG0rWk5UYzBxeUZsRXJ1aE9POXJtbHE3YkR0UEhlVjZFR2lNcFlVczRpVUJQcTJkcTBscWxHRlwvV3p3eUUiLCJtYWMiOiI1ODFlYjdlZGQ5ODhmZWNlNmZhNjYxZTM0ZWE5ZDcxMjg1OTVkZDc2ZGY3MDM0N2FkNDdjY2ZhNzZkY2EyNTI5In0=','eyJpdiI6Ik5cL29SNURUOFcwdXVBME1wUlwvUnpTQT09IiwidmFsdWUiOiJIMVhCbTIzXC9SUFpLeVZcL0NxaDdvZ2c9PSIsIm1hYyI6ImFmOTExY2FiNDU1MWIxZTAyYmMyMGE0ZWJiMjkxMzFhMTRhN2FhZGYwM2NiMzBmYjVkMDg4YTRkNjFlZTlmYjkifQ==','eyJpdiI6IkVHQlNnZ09jUmdnOWk4WEtvdjdmS1E9PSIsInZhbHVlIjoiSkdxMTlhbGdXYmNNRGtSS3AxajQ2QT09IiwibWFjIjoiOTNiNWZhODYwNTI4Yzg4NzQ2OWE0ZjBlNWEyZWJjMTkzZTk5NTFjYzYwYTQ4MzA3Yzc2MGI3MWZmMzNjZDE1ZiJ9','bVknEL0Y3WRDigcIYgfeoWRDXCraRXqporDn7Itj.zip','2014-08-05','Science Math B',11.00,'DEUG','Université Ibn Zohr','Faculte des sciences d\'Agadir (FSA)','2016-07-05',10.00,10.00,10.00,10.00,10.00,'math physique','Licence Fondamentale','Université Ibn Zohr','Faculte des sciences d\'Agadir (FSA)','2017-06-12',10.00,10.00,10.00,'info gestion',12.00,NULL,'2017-06-27 21:43:03','2017-08-15 22:55:04');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gears`
--

DROP TABLE IF EXISTS `gears`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gears` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `val` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gears`
--

LOCK TABLES `gears` WRITE;
/*!40000 ALTER TABLE `gears` DISABLE KEYS */;
INSERT INTO `gears` VALUES (1,'$2y$10$Z6E57lef5WMpPPDcRHUNgO9vmXFSs1KwNmTv6Mopttp.RW9jIzQFe','$2y$10$kMEps6VGNrTI5931nXxuQuwSJMHwXZ8nX/nVm.YzC8eiDiv6kd9EC','2017-07-04 22:39:22','2017-08-15 22:55:19'),(2,'$2y$10$N5NbhhFmLSHCj5q.9qjrqO9AAq9ixfPze42ORA1EedWHq1wub.0Fi','eyJpdiI6IjdpNTZuMFlzbWNjNDNtYjgwSWpqSFE9PSIsInZhbHVlIjoiOTlHeVlhblFWOVRNMndld0Rzb3JRRWtGVGdRdnlaQnE2RERvVFJla1wvQ1lUZnFWWHh4YTlZb3hKWXc5Y21zeGkiLCJtYWMiOiI0ZGI3ZDVkN2JjM2ZhNmQ5YjQxNDRkMGEzM2JiNGRjZjgzYWMxODE2ZjgxNzg3NmY3OTQ1NmZhZmQ3ZDgxZmY5In0=','2017-08-12 20:10:42','2017-08-15 21:12:59');
/*!40000 ALTER TABLE `gears` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matieres`
--

DROP TABLE IF EXISTS `matieres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `matieres` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `semester` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `volume` int(10) unsigned NOT NULL,
  `description` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `prof_id` int(10) unsigned NOT NULL,
  `module_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `matieres_prof_id_foreign` (`prof_id`),
  KEY `matieres_module_id_foreign` (`module_id`),
  CONSTRAINT `matieres_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`),
  CONSTRAINT `matieres_prof_id_foreign` FOREIGN KEY (`prof_id`) REFERENCES `professors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matieres`
--

LOCK TABLES `matieres` WRITE;
/*!40000 ALTER TABLE `matieres` DISABLE KEYS */;
INSERT INTO `matieres` VALUES (2,'sjddsjbd','bisd11','Semestre 1',10,'sdsdnsjfnjsnfjsnjfnsj',5,3,'2017-08-25 23:05:47','2017-08-25 23:05:47');
/*!40000 ALTER TABLE `matieres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2017_04_20_161810_create_students_table',1),(4,'2017_04_20_163041_create_classes_table',1),(5,'2017_04_20_163110_create_lessons_table',1),(6,'2017_04_20_163126_create_courses_table',1),(7,'2017_04_20_163157_create_teachers_table',1),(9,'2017_04_20_162334_create_candidates_table',2),(12,'2017_06_27_220234_create_gears_table',3),(15,'2017_07_05_000526_create_news_table',4),(17,'2017_05_23_214003_create_activities_table',5),(20,'2017_08_19_210801_create_professors_table',6),(21,'2017_08_24_204529_create_modules_table',7),(22,'2017_08_25_211219_create_matieres_table',8);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `semester` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `volume` int(10) unsigned NOT NULL,
  `description` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `prof_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `modules_prof_id_foreign` (`prof_id`),
  CONSTRAINT `modules_prof_id_foreign` FOREIGN KEY (`prof_id`) REFERENCES `professors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES (3,'big data','bisd1','Semestre 1',10,'dvjbvfdjbgdgdjbgjd',5,'2017-08-25 21:49:06','2017-08-25 22:28:51'),(4,'sbhdsbdh','bisd2','Semestre 2',10,'dfdjfnjdnfgjdnfgjndjgndgdg',4,'2017-08-25 21:50:36','2017-08-25 21:50:36');
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `title` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `sub` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `desc` text COLLATE utf8_unicode_ci NOT NULL,
  `tag` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `file` varchar(251) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (9,'2017-07-22 00:00:00','2017-07-25 00:00:00','nnot filledd','subtitle','Is it right ? So i do not need use your code : Storage::disk(\'local\') ? right ? I neer','FsG3ykmJUM1g9EJJbC0YEhOHbOjPZ8OPzgJmSY2a.png','qOlZoKC6vwtZ8P7Wkaw1sRmPRcnISI1DhlNmYl47.png','2017-07-22 21:18:15','2017-07-23 15:11:50'),(10,'2017-07-22 00:00:00','2017-07-23 00:00:00','second title','subtitle','Is it right ? So i do not need use your code : Storage::disk(\'local\') ? right Is it right ? So i do not need use your code : Storage::disk(\'local\') ? right Is it right ? So i do not need use your code : Storage::disk(\'local\') ? right','yHBXRFrLr41Ofl2xyQ85QrbOx3Pr25XXD8PrBNWh.png',NULL,'2017-07-22 21:19:15','2017-07-23 17:22:19');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professors`
--

DROP TABLE IF EXISTS `professors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `professors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `birth_date` datetime NOT NULL,
  `first_name` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `speciality` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `establishment` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `grade` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `facebook` varchar(251) COLLATE utf8_unicode_ci DEFAULT NULL,
  `linkedin` varchar(251) COLLATE utf8_unicode_ci DEFAULT NULL,
  `twitter` varchar(251) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professors`
--

LOCK TABLES `professors` WRITE;
/*!40000 ALTER TABLE `professors` DISABLE KEYS */;
INSERT INTO `professors` VALUES (4,'2017-08-09 00:00:00','nvdjvn','dfjdn','vdjnvjdfn','a@gmail.com','nvjcnvj','Pr. Habilité','vdncvbjfnjbfvb','vdkcnvbsdfbn','ndvjvnfjnbvjf','ZYJA6xMN1IGwpxb1ADWNWT6Rkz2dsQdWsnEMs67J.jpeg','2017-08-24 19:06:37','2017-08-24 19:28:20'),(5,'2017-08-09 00:00:00','nvdjvn','dfjdn','vdjnvjdfn','ad@gmail.com','nvjcnvj','Pr. Assistant','vdncvbjfnjbfvb',NULL,NULL,'xSezhkxWMnHJ52QtRXC88yTnIFKrTmyFSPsR2vUe.png','2017-08-24 19:06:59','2017-08-24 19:06:59'),(6,'2017-08-09 00:00:00','nvdjvn','dfjdn','vdjnvjdfn','a@gmail.com','nvjcnvj','Pr. Habilité',NULL,'vdkcnvbsdfbn',NULL,'NJRlq1qm1lP70ESFD8nWaDug1yVyV7WVpM9NXKyq.jpeg','2017-08-24 19:29:01','2017-08-24 19:29:01');
/*!40000 ALTER TABLE `professors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `flag` varchar(251) COLLATE utf8_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_password_unique` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'administrator','eyJpdiI6IlMwUkZ4Y0FMVXpUT1E3eXYxZU5TMXc9PSIsInZhbHVlIjoiQmRmemVDZXpuOGtzK0RqSlNaMXltdVplNE9xajE5MDhianhqWDVTZlRKYz0iLCJtYWMiOiJjMzVhMzUyYjgzYTQxNWMyNTM3M2Y1YTE4YzQyMzdmYmRiNDgxNzdlYWRmM2I3ZTNmOWI3OTM3ZjA0MTM2YWFjIn0=','$2y$10$pKp036HGvO5/f56tYQ/Pvegb.1Hv8Ne7MEeQEgFIK0fpYKiZpB4ia','eyJpdiI6IlJkbERGY2tYdFZ3dE1aUWdOV3B2aHc9PSIsInZhbHVlIjoiK0lhdDNcL2VQaGxaazVzNThSYTE2aEE9PSIsIm1hYyI6Ijk4YjY5NWI3NDhjMThhMjMwNzViOTdlNjc5YThmNDUwNzIyMzkxNjdjZTMxYzlhM2M1OTc4OWZjMzFkMThhOTYifQ==',NULL,NULL,NULL),(2,'1111402869','maguerra.soufiane@gmail.com','$2y$10$F78wQDhqg3YlRHFP4bdxeeY8jQp14sYECBnrvl46jnLcRobIvZfQy','eyJpdiI6IndVZ0lpU1RQTHlPalZBY3Ztelh6Rmc9PSIsInZhbHVlIjoiWDlDUWtpS1VSU1VyTmw1bm9sY2ZzV1NsZjR4WkZXNml2XC9qXC9ydmZUT0JjPSIsIm1hYyI6IjA4NGY5MmI0NzhjNDM4MWRjODczM2MzNGE3M2ZhMWE1OGM1NDhhNjZmN2Y2ODNlMGRkODMzYTRiZDQ1YjIyZWUifQ==','fSsT7YqcIRwWS0A24hrGl9ZTlZ4sm0D7JsHHjPr46OKrksuASkpL8wjEPx6h','2017-06-27 21:43:02','2017-08-13 21:52:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-09-23 16:38:39
