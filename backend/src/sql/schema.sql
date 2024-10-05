-- Drop tables if they exist
DROP TABLE IF EXISTS Purchase;
DROP TABLE IF EXISTS Favorite;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS User;

-- Categorías de los productos
CREATE TABLE Category (
                      id BIGINT AUTO_INCREMENT,
                      name VARCHAR(100) NOT NULL UNIQUE,
                      parent_category_id BIGINT,
                      CONSTRAINT Category_PK PRIMARY KEY (id),
                      CONSTRAINT Category_Parent_FK FOREIGN KEY (parent_category_id) REFERENCES Category(id) ON DELETE SET NULL
) ENGINE = InnoDB;

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
                     quality TINYINT,
                     latitude DOUBLE NOT NULL,
                     longitude DOUBLE NOT NULL,
                     userId BIGINT NOT NULL,
                     categoryId BIGINT NOT NULL,
                     CONSTRAINT Product_PK PRIMARY KEY (id),
                     CONSTRAINT User_Product_FK FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
                     CONSTRAINT Category_Product_FK FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Imagenes de los productos
CREATE TABLE product_images (
                    product_id BIGINT NOT NULL,
                    image VARCHAR(255),
                    PRIMARY KEY (product_id, image) ,
                    FOREIGN KEY (product_id) REFERENCES Product(id)
) ENGINE = InnoDB;

-- Compras del usuario
CREATE TABLE Purchase (
                      id BIGINT AUTO_INCREMENT,
                      buyerId BIGINT NOT NULL,
                      sellerId BIGINT NOT NULL,
                      productId BIGINT NOT NULL,
                      purchaseDate DATETIME NOT NULL,
                      amount DOUBLE NOT NULL,
                      CONSTRAINT Purchase_PK PRIMARY KEY (id),
                      CONSTRAINT Buyer_FK FOREIGN KEY (buyerId) REFERENCES User(id) ON DELETE CASCADE,
                      CONSTRAINT Seller_FK FOREIGN KEY (sellerId) REFERENCES User(id) ON DELETE CASCADE,
                      CONSTRAINT Product_Purchase_FK FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Productos favoritos del usuario
CREATE TABLE Favorite (
                      id BIGINT AUTO_INCREMENT,
                      userId BIGINT NOT NULL,
                      productId BIGINT NOT NULL,
                      favoritedAt DATETIME NOT NULL,
                      CONSTRAINT Favorite_PK PRIMARY KEY (id),
                      CONSTRAINT User_Favorite_FK FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
                      CONSTRAINT Product_Favorite_FK FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
) ENGINE = InnoDB;