-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2026 at 12:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portfolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `user_id`, `title`, `file_path`, `created_at`) VALUES
(1, 7, 'haha', '/uploads/certificates/1769909969583-download (3).jpg', '2026-02-01 01:39:29'),
(2, 7, 'sda', '/uploads/certificates/1769910189057-download (3).jpg', '2026-02-01 01:43:09'),
(3, 7, 'sfafa', '/uploads/certificates/1769910210898-download (3).jpg', '2026-02-01 01:43:30'),
(4, 7, 'afs', '/uploads/certificates/1769910363786-download (3).jpg', '2026-02-01 01:46:03'),
(5, 7, 'aafdf', '/uploads/certificates/1769910432754-download (3).jpg', '2026-02-01 01:47:12'),
(6, 7, 'asafd', '/uploads/certificates/1769910512930-download (3).jpg', '2026-02-01 01:48:32'),
(7, 7, 'asffsfsdf', '/uploads/certificates/1769910549785-download (3).jpg', '2026-02-01 01:49:09'),
(8, 7, 'dasa', '/uploads/certificates/1769910569658-download (3).jpg', '2026-02-01 01:49:29'),
(9, 7, 'afsdfsf', '/uploads/certificates/1769910627816-download (3).jpg', '2026-02-01 01:50:27'),
(10, 7, 'saafd', '/uploads/certificates/1769910642329-JHS RiSci Admissions 2026 Application Form.pdf', '2026-02-01 01:50:42'),
(11, 7, 'dfsfs', '/uploads/certificates/1769910712753-INTERVIEW QUESTIONNAIRE FOR PROFESSORS1.0.pdf', '2026-02-01 01:51:52'),
(12, 7, 'sjkhjk', '/uploads/certificates/1769910737621-level0.drawio.pdf', '2026-02-01 01:52:17'),
(13, 7, 'dsfgdfg', '/uploads/certificates/1769910947510-level0.drawio.pdf', '2026-02-01 01:55:47'),
(14, 7, 'sgsfgdfg', '/uploads/certificates/1769911015987-Introduction To Information Management.pdf', '2026-02-01 01:56:56'),
(15, 7, 'jkhk', '/uploads/certificates/1769911043252-JHS RiSci Admissions 2026 Application Form.pdf', '2026-02-01 01:57:23'),
(16, 7, 'la', '/uploads/certificates/1769911150175-JHS RiSci Admissions 2026 Application Form.pdf', '2026-02-01 01:59:10'),
(17, 7, 'hdfjf', '/uploads/certificates/1769911218259-JHS RiSci Admissions 2026 Application Form.pdf', '2026-02-01 02:00:18'),
(18, 7, 'fdfd', '/uploads/certificates/1769911286888-download (3).jpg', '2026-02-01 02:01:26'),
(19, 7, 'kdsdgf', '/uploads/certificates/1769911325709-download (3).jpg', '2026-02-01 02:02:05'),
(20, 7, 'jkuiku', '/uploads/certificates/1769911367653-download (3).jpg', '2026-02-01 02:02:47'),
(21, 7, 'a', '/uploads/certificates/1769911510719-download (3).jpg', '2026-02-01 02:05:10'),
(22, 7, 'bsahdad', '/uploads/certificates/1769911706331-download (3).jpg', '2026-02-01 02:08:26'),
(23, 7, 'fasf', '/uploads/certificates/1769911740838-download (3).jpg', '2026-02-01 02:09:00'),
(24, 7, 'fsdgdfg', '/uploads/certificates/1769912000406-download (3).jpg', '2026-02-01 02:13:20'),
(25, 7, 'nshdfs', '/uploads/certificates/1769912043348-download (3).jpg', '2026-02-01 02:14:03'),
(26, 7, 'hghasd', '/uploads/certificates/1769912320438-download (3).jpg', '2026-02-01 02:18:40'),
(27, 7, 'dgfgf', '/uploads/certificates/1769912622819-download (3).jpg', '2026-02-01 02:23:42'),
(28, 7, 'jdbasdb an', '/uploads/certificates/1769912653373-download (3).jpg', '2026-02-01 02:24:13'),
(29, 7, 'dbfs', '/uploads/certificates/1769913443924-download (3).jpg', '2026-02-01 02:37:23'),
(30, 7, 'ghdhg', '/uploads/certificates/1769913567700-download (3).jpg', '2026-02-01 02:39:27'),
(31, 7, 'l', '/uploads/certificates/1769913597692-download (3).jpg', '2026-02-01 02:39:57'),
(32, 7, 'f', '/uploads/certificates/1769913623040-download (3).jpg', '2026-02-01 02:40:23'),
(33, 7, 'g', '/uploads/certificates/1769913678126-download (3).jpg', '2026-02-01 02:41:18'),
(34, 7, 'g', '/uploads/certificates/1769913904753-download (3).jpg', '2026-02-01 02:45:04'),
(35, 7, 'nas ba', '/uploads/certificates/1769913946101-download (3).jpg', '2026-02-01 02:45:46'),
(36, 7, 'jbdsbf', '/uploads/certificates/1769914062130-download (3).jpg', '2026-02-01 02:47:42'),
(37, 7, 'h', '/uploads/certificates/1769914123130-download (3).jpg', '2026-02-01 02:48:43'),
(38, 7, 'hvvvg', '/uploads/certificates/1769914270541-download (3).jpg', '2026-02-01 02:51:10'),
(39, 7, 'g', '/uploads/certificates/1769914295173-download (3).jpg', '2026-02-01 02:51:35'),
(40, 7, 't', '/uploads/certificates/1769914435537-download (3).jpg', '2026-02-01 02:53:55'),
(41, 7, 'b', '/uploads/certificates/1769914489852-download (3).jpg', '2026-02-01 02:54:49'),
(42, 7, 'm', '/uploads/certificates/1769914540934-download (3).jpg', '2026-02-01 02:55:40'),
(43, 7, 'mb', '/uploads/certificates/1769914568935-download (3).jpg', '2026-02-01 02:56:08'),
(44, 7, 'n', '/uploads/certificates/1769914643553-download (3).jpg', '2026-02-01 02:57:23'),
(45, 7, 'g', '/uploads/certificates/1769914765732-download (3).jpg', '2026-02-01 02:59:25'),
(46, 7, 'r', '/uploads/certificates/1769914802345-download (3).jpg', '2026-02-01 03:00:02'),
(47, 7, 'vnvjh', '/uploads/certificates/1769914843918-download (3).jpg', '2026-02-01 03:00:43'),
(48, 2, 'iugyfdthfhxgcjh', '/uploads/certificates/1770276705156-download (1).jpg', '2026-02-05 07:31:45');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `user_id`, `skill_name`, `created_at`) VALUES
(1, 7, 'adafafafs', '2026-01-31 03:34:02'),
(2, 7, 'player', '2026-01-31 03:44:28'),
(3, 7, 'asfaf', '2026-02-01 08:50:21'),
(4, 7, 'abfanf', '2026-02-01 08:50:28'),
(5, 2, 'yifgj', '2026-02-05 07:31:08'),
(6, 2, 'yfugl', '2026-02-05 07:31:13'),
(7, 2, '13245678iujhbv', '2026-02-05 07:31:19'),
(8, 2, 'jhnn', '2026-02-05 07:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `socials`
--

CREATE TABLE `socials` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `socials`
--

INSERT INTO `socials` (`id`, `user_id`, `platform`, `url`, `created_at`) VALUES
(1, 7, 'afa', 'https://www.bilibili.tv/en/video/4796162205554688', '2026-01-31 13:16:31'),
(2, 7, 'ig', 'https://www.instagram.com/elowyn.lunie/', '2026-01-31 13:17:13'),
(3, 7, 'aad', 'https://www.bilibili.tv/en/video/4796162205554688', '2026-01-31 13:21:34'),
(4, 7, 'afdsfh', 'https://www.bilibili.tv/en/video/4796162205554688', '2026-01-31 13:23:45'),
(5, 7, 'adad', 'https://bili.im/DkkcXWo', '2026-01-31 13:24:41'),
(6, 7, 'nd basd', 'https://bili.im/DkkcXWo', '2026-02-01 02:42:22'),
(7, 2, 'higuguh', 'http://localhost:3000/', '2026-02-05 07:32:07'),
(8, 11, 'sd', 'fsd', '2026-02-05 08:17:27'),
(9, 2, ', kjbiyvuhij', 'http://localhost:3000/', '2026-03-03 05:42:56'),
(10, 2, 'facebook', 'https://www.facebook.com/', '2026-03-03 06:05:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `fullname` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `fullname`, `email`, `password_hash`) VALUES
(1, 'afba', 'njafa', 'jaf as', '$2b$10$cq/QMCjNb5Ca7PvSu/0Gi.yeVAacF9HhK6hw5ZA0gmwNvmQrsiLG2'),
(2, 'jem', 'Jejndfsd', 'j@gmail.com', '$2b$10$P5vdmogP6wMkjtt5guktgeVPYfH3wXxGsi7aZTQTPfjqCLRuvr4Ga'),
(4, 'luna', 'luna', 'luna@gmail.com', '$2b$10$zBuw8/JHkFEvdhmpAHshRu82IvSn3rR5oo7NM2aE5C2VOOUvUkzP.'),
(7, 'gab', 'gab', 'gab', '$2b$10$MFToht0OSXmIexJuOzZzO.lldZG4QNqR3PXBAfO0kO7hPJe3lg2em'),
(8, 'chae', 'chae', 'chae@gmail.com', '$2b$10$d4XBd.8onzcZ2Jq3g0oBBO380fOCrBk/ejwVFB7ZQN0xMSMTDNAHO'),
(10, 'gaby', 'gab', 'gab@gmail.com', '$2b$10$bgBZ3bYWmxh2OHaa5toAseikJjzWoxP8gyvcO9FGBzjLC3kdlZIEG'),
(11, 'cxlcyyween', 'cxlcyyween', 'c@gmail.com', '$2b$10$BiubD5SE72F4deARAWZPcOKvryfa5gQC7tZWPUvPTWLLQhlIfFC/.'),
(12, 'lon', 'lun', 'lun@', '$2b$10$wM/YyMRo3kvo8zlQio6Ig.mxS5XQLeKk60ccbrp1FSh0wlcnqWHna'),
(16, 'sdfghjk', 'jhgfdsdfg', 'hjkjlljhgfd@gmail.com', '$2b$10$etM0yMvoaoPDIVrAlYt8IulEnFgb0uO.TAy4hk50YwaJQmoXqabny'),
(17, 'ljkjhghfgf345', 'fgfdsdfg7564534', 'as87654dc@gmail.com', '$2b$10$XUENcvb0eUhi5wOJ8wh3eeg6Ai2.ydaQAPQoEQUHDzBkbkIqCmR8S');

-- --------------------------------------------------------

--
-- Table structure for table `user_introduction`
--

CREATE TABLE `user_introduction` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `introduction` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_introduction`
--

INSERT INTO `user_introduction` (`id`, `user_id`, `introduction`) VALUES
(1, 7, 'wassup ebriwan & ebritu'),
(6, 2, 'hsadfhejnasdfasopihuvywhsd'),
(8, 11, ''),
(18, 12, 'nihjcghdfgdfg');

-- --------------------------------------------------------

--
-- Table structure for table `user_profile_pics`
--

CREATE TABLE `user_profile_pics` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profile_pics`
--

INSERT INTO `user_profile_pics` (`id`, `user_id`, `profile_pic`) VALUES
(1, 7, '/uploads/1771044730644.jpg'),
(2, 10, '/uploads/1769168474900.jpg'),
(5, 2, '/uploads/1770280494181.jpg'),
(8, 11, '/uploads/1770278385404.jpg'),
(10, 12, '/uploads/1770281783726.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `socials`
--
ALTER TABLE `socials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_introduction`
--
ALTER TABLE `user_introduction`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `user_profile_pics`
--
ALTER TABLE `user_profile_pics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `socials`
--
ALTER TABLE `socials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `user_introduction`
--
ALTER TABLE `user_introduction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `user_profile_pics`
--
ALTER TABLE `user_profile_pics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `skills`
--
ALTER TABLE `skills`
  ADD CONSTRAINT `skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `socials`
--
ALTER TABLE `socials`
  ADD CONSTRAINT `socials_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_introduction`
--
ALTER TABLE `user_introduction`
  ADD CONSTRAINT `user_introduction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profile_pics`
--
ALTER TABLE `user_profile_pics`
  ADD CONSTRAINT `user_profile_pics_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
