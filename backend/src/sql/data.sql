-- Categorías principales
INSERT INTO Category (name, parent_category_id) VALUES ('Electrónica', NULL);
SET @electronica_id = LAST_INSERT_ID();

INSERT INTO Category (name, parent_category_id) VALUES ('Moda', NULL);
SET @moda_id = LAST_INSERT_ID();

INSERT INTO Category (name, parent_category_id) VALUES ('Deportes', NULL);
SET @deportes_id = LAST_INSERT_ID();

-- Subcategorías para Electrónica
INSERT INTO Category (name, parent_category_id) VALUES ('Móviles', @electronica_id);
INSERT INTO Category (name, parent_category_id) VALUES ('Ordenadores', @electronica_id);
INSERT INTO Category (name, parent_category_id) VALUES ('Televisores', @electronica_id);

-- Subcategorías para Moda
INSERT INTO Category (name, parent_category_id) VALUES ('Ropa', @moda_id);
INSERT INTO Category (name, parent_category_id) VALUES ('Calzado', @moda_id);
INSERT INTO Category (name, parent_category_id) VALUES ('Accesorios', @moda_id);

-- Subcategorías para Deportes
INSERT INTO Category (name, parent_category_id) VALUES ('Equipamiento Deportivo', @deportes_id);
INSERT INTO Category (name, parent_category_id) VALUES ('Ropa Deportiva', @deportes_id);
INSERT INTO Category (name, parent_category_id) VALUES ('Calzado Deportivo', @deportes_id);