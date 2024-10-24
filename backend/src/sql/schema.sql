-- Drop tables if they exist
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS PurchaseItem;
DROP TABLE IF EXISTS Purchase;
DROP TABLE IF EXISTS Favorite;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS ShoppingCartItem;
DROP TABLE IF EXISTS ShoppingCart;
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



-- Carro de compra
CREATE TABLE ShoppingCart (
                         id BIGINT AUTO_INCREMENT,
                         user_id BIGINT NOT NULL,
                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT ShoppingCart_PK PRIMARY KEY (id),
                         CONSTRAINT User_ShoppingCart_PK FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
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



-- Items del carro de compra
CREATE TABLE ShoppingCartItem (
                         id BIGINT AUTO_INCREMENT,
                         cart_id BIGINT NOT NULL,
                         product_id BIGINT NOT NULL,
                         quantity INT NOT NULL,
                         CONSTRAINT ShoppingCartItem_PK PRIMARY KEY (id),
                         CONSTRAINT ShoppingCart_ShoppingCartItem_FK FOREIGN KEY (cart_id) REFERENCES ShoppingCart(id) ON DELETE CASCADE,
                         CONSTRAINT Product_ShoppingCartItem_FK FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
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
                          buyer_id BIGINT NOT NULL,
                          seller_id BIGINT NOT NULL,
                          purchaseDate DATETIME NOT NULL,
                          amount DOUBLE NOT NULL,
                          payment_method VARCHAR(255) NOT NULL,
                          order_id VARCHAR(255) NOT NULL UNIQUE,
                          capture_id VARCHAR(255) UNIQUE,
                          is_refunded BOOLEAN NOT NULL DEFAULT FALSE,
                          purchaseStatus VARCHAR(50) NOT NULL,
                          CONSTRAINT Purchase_PK PRIMARY KEY (id),
                          CONSTRAINT Buyer_FK FOREIGN KEY (buyer_id) REFERENCES User(id) ON DELETE CASCADE,
                          CONSTRAINT Seller_FK FOREIGN KEY (seller_id) REFERENCES User(id) ON DELETE CASCADE
) ENGINE = InnoDB;



-- Items de la compra
CREATE TABLE PurchaseItem (
                          id BIGINT AUTO_INCREMENT,
                          purchase_id BIGINT NOT NULL,
                          product_id BIGINT NOT NULL,
                          quantity INT NOT NULL,
                          CONSTRAINT PurchaseItem_PK PRIMARY KEY (id),
                          CONSTRAINT Purchase_PurchaseItem_FK FOREIGN KEY (purchase_id) REFERENCES Purchase(id) ON DELETE CASCADE,
                          CONSTRAINT Product_PurchaseItem_FK FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
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



-- Notificaciones (notificación al vendedor cuando alguien compra su producto)
CREATE TABLE Notification (
                          id BIGINT AUTO_INCREMENT,
                          purchase_id BIGINT NOT NULL,
                          message TEXT NOT NULL,
                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          is_read BOOLEAN NOT NULL DEFAULT FALSE,
                          CONSTRAINT Notification_PK PRIMARY KEY (id),
                          CONSTRAINT Purchase_Notification_FK FOREIGN KEY (purchase_id) REFERENCES Purchase(id) ON DELETE CASCADE
) ENGINE = InnoDB;