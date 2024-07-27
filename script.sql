CREATE DATABASE IF NOT EXISTS `usermanagement`
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_general_ci;

USE `usermanagement`;

CREATE TABLE IF NOT EXISTS `user` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `disabled` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `user` (`username`, `password`, `email`) 
VALUES ('admin', 'admin', 'admin@gmail.com');


CREATE TABLE IF NOT EXISTS `usergroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupname` varchar(50) NOT NULL,
  `username` varchar(50),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`username`) REFERENCES `user`(`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `usergroup` (`id`, `groupname`, `username`) 
VALUES (1, 'admin', 'admin');