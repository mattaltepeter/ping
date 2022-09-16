CREATE DATABASE IF NOT EXISTS ping;
USE ping;
CREATE TABLE IF NOT EXISTS `results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `host` varchar(128) DEFAULT NULL,
  `resolvedIp` varchar(40) DEFAULT NULL,
  `min` float(10,3) DEFAULT NULL,
  `max` float(10,3) DEFAULT NULL,
  `avg` float(10,3) DEFAULT NULL,
  `stddev` float(10,3) DEFAULT NULL,
  `packetLoss` float(6,3) DEFAULT NULL,
  `startTime` timestamp NULL DEFAULT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  `isGateway` tinyint(1) DEFAULT '0',
  `packetsSent` int(11) DEFAULT NULL,
  `output` text,
  PRIMARY KEY (`id`),
  KEY `host` (`host`) USING BTREE,
  KEY `startTime` (`startTime`) USING BTREE,
  KEY `endTime` (`endTime`) USING BTREE,
  KEY `isGateway` (`isGateway`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;