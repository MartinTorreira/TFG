DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS User;

-- Usuarios de la aplicación
CREATE TABLE User (
                      id BIGINT AUTO_INCREMENT,
                      userName VARCHAR(60) COLLATE latin1_bin NOT NULL UNIQUE,
                      password VARCHAR(60) NOT NULL,
                      firstName VARCHAR(60) NOT NULL,
                      lastName VARCHAR(60) NOT NULL,
                      email VARCHAR(60) NOT NULL UNIQUE,
                      rate INT,
                      role TINYINT,
                      avatar VARCHAR(255),
                      CONSTRAINT UserPK PRIMARY KEY (id),
                      CONSTRAINT UserNameUniqueKey UNIQUE (userName)
) ENGINE = InnoDB;



-- Productos de la aplicación
CREATE TABLE Product (
                         id BIGINT AUTO_INCREMENT,
                         name VARCHAR(255) NOT NULL,
                         description TEXT,
                         price DOUBLE NOT NULL,
                         quantity INT NOT NULL,
                         image VARCHAR(255),
                         userId BIGINT NOT NULL,
                         CONSTRAINT Product_PK PRIMARY KEY (id),
                         CONSTRAINT User_Product_FK FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
) ENGINE = InnoDB;


