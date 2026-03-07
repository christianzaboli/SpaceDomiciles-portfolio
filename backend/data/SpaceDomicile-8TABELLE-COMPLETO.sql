-- =====================================================
-- SPACDOMICILE - DATABASE COMPLETO CON 8 TABELLE + DATI
-- =====================================================

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `certificates`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `invoices_stack`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `stacks`;
DROP TABLE IF EXISTS `planets`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `galaxies`;

-- =====================================================
-- CREATE TABLE GALAXIES
-- =====================================================

CREATE TABLE `galaxies`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL
);

-- =====================================================
-- CREATE TABLE PLANETS
-- =====================================================

CREATE TABLE `planets`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_galaxy` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `planet_size` BIGINT NOT NULL,
  `temperature_min` INT NOT NULL,
  `temperature_max` INT NOT NULL,
  `population` BIGINT NOT NULL,
  `surface_available` BIGINT NOT NULL,
  `distance_from_earth` BIGINT NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL
);

-- =====================================================
-- CREATE TABLE STACKS
-- =====================================================

CREATE TABLE `stacks`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_planet` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(8, 2) NOT NULL,
  `stock` VARCHAR(255) NOT NULL,   -- fare su sql: ALTER TABLE stacks MODIFY stock varchar(255);
  `slug` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL
);

ALTER TABLE `stacks` ADD UNIQUE `stacks_slug_unique`(`slug`);

-- =====================================================
-- CREATE TABLE INVOICES_STACK
-- =====================================================

CREATE TABLE `invoices_stack`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `stack_id` INT UNSIGNED NOT NULL,
  `invoices_id` INT UNSIGNED NOT NULL,
  `price` DECIMAL(8, 2) NOT NULL,
  `quantity` SMALLINT NOT NULL,
  `stack_name` VARCHAR(255) NOT NULL
);

-- =====================================================
-- CREATE TABLE INVOICES
-- =====================================================

CREATE TABLE `invoices`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT UNSIGNED NOT NULL,
  `shipping_address` VARCHAR(255) NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `invoice_address` VARCHAR(255) NOT NULL,
  `invoice_email` VARCHAR(255) NOT NULL,
  `invoice_date` TIMESTAMP NOT NULL,
  `invoice_status` VARCHAR(255) NOT NULL
);

-- =====================================================
-- CREATE TABLE CUSTOMERS
-- =====================================================

CREATE TABLE `customers`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `billing_address` VARCHAR(255) NOT NULL,
  `default_shipping_address` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL
);

ALTER TABLE `customers` ADD UNIQUE `customers_email_unique`(`email`);

-- =====================================================
-- CREATE TABLE PAYMENTS
-- =====================================================

CREATE TABLE `payments`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `invoices_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `method` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `transaction_id` VARCHAR(255) NOT NULL,
  `paid_at` DATETIME NOT NULL
);

-- =====================================================
-- CREATE TABLE CERTIFICATES
-- =====================================================

CREATE TABLE `certificates`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `stack_invoices_id` INT UNSIGNED NOT NULL,
  `certificate_code` VARCHAR(255) NOT NULL,
  `issued_at` TIMESTAMP NOT NULL,
  `pdf_url` VARCHAR(255) NOT NULL
);

-- =====================================================
-- ADD FOREIGN KEYS
-- =====================================================

ALTER TABLE `payments` ADD CONSTRAINT `payments_invoices_id_foreign` FOREIGN KEY(`invoices_id`) REFERENCES `invoices`(`id`);

ALTER TABLE `certificates` ADD CONSTRAINT `certificates_stack_invoices_id_foreign` FOREIGN KEY(`stack_invoices_id`) REFERENCES `invoices_stack`(`id`);

ALTER TABLE `invoices_stack` ADD CONSTRAINT `invoices_stack_invoices_id_foreign` FOREIGN KEY(`invoices_id`) REFERENCES `invoices`(`id`);

ALTER TABLE `invoices` ADD CONSTRAINT `invoices_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `customers`(`id`);

ALTER TABLE `stacks` ADD CONSTRAINT `stacks_id_planet_foreign` FOREIGN KEY(`id_planet`) REFERENCES `planets`(`id`);

ALTER TABLE `planets` ADD CONSTRAINT `planets_id_galaxy_foreign` FOREIGN KEY(`id_galaxy`) REFERENCES `galaxies`(`id`);

ALTER TABLE `invoices_stack` ADD CONSTRAINT `invoices_stack_stack_id_foreign` FOREIGN KEY(`stack_id`) REFERENCES `stacks`(`id`);

-- =====================================================
-- INSERT DATA INTO GALAXIES
-- =====================================================

INSERT INTO `galaxies` (`id`, `name`, `description`) VALUES
(1, 'Via Lattea', 'La nostra galassia spirale nel cuore dell universo'),
(2, 'Andromeda', 'La galassia piu vicina alla Via Lattea');

-- =====================================================
-- INSERT DATA INTO PLANETS
-- =====================================================

INSERT INTO `planets` (`id`, `id_galaxy`, `name`, `planet_size`, `temperature_min`, `temperature_max`, `population`, `surface_available`, `distance_from_earth`, `description`, `image`) VALUES
(1, 1, 'Mercurio', 74797000, -173, 427, 0, 74797000, 57909050, 'Il pianeta piu piccolo e vicino al sole', 'mercurio.jpg'),
(2, 1, 'Venere', 460234000, 462, 462, 0, 460234000, 108208000, 'Il pianeta piu caldo con vulcani attivi', 'venere.jpg'),
(3, 1, 'Marte', 144371000, -125, 20, 3933000000, 144371000, 227923000, 'Il pianeta rosso ideale per colonizzazione', 'marte.jpg'),
(4, 1, 'Giove', 61418000000, -110, 24, 318000000000, 61418000000, 778570000, 'Il gigante gassoso piu grande del sistema', 'giove.jpg'),
(5, 1, 'Saturno', 50724000000, -140, 27, 95000000000, 50724000000, 1429400000, 'Il pianeta con gli anelli spettacolari', 'saturno.jpg'),
(6, 1, 'Urano', 15759200000, -224, -97, 14700000000, 15759200000, 2870972000, 'Il gigante di ghiaccio con rotazione anomala', 'urano.jpg'),
(7, 1, 'Nettuno', 17148300000, -200, -100, 17000000000, 17148300000, 4495060000, 'Il pianeta piu lontano dal sole', 'nettuno.jpg');

-- =====================================================
-- INSERT DATA INTO CUSTOMERS
-- =====================================================

INSERT INTO `customers` (`id`, `email`, `full_name`, `billing_address`, `default_shipping_address`, `country`, `phone`) VALUES
(1, 'marco.rossi@email.com', 'Marco Rossi', 'Via Roma 123, Milano', 'Via Roma 123, Milano', 'Italia', '+39 3331234567'),
(2, 'anna.bianchi@email.com', 'Anna Bianchi', 'Piazza Duomo 456, Roma', 'Piazza Duomo 456, Roma', 'Italia', '+39 3339876543'),
(3, 'giuseppe.verdi@email.com', 'Giuseppe Verdi', 'Viale Liberta 789, Palermo', 'Viale Liberta 789, Palermo', 'Italia', '+39 3334567890'),
(4, 'francesca.neri@email.com', 'Francesca Neri', 'Corso Garibaldi 321, Torino', 'Corso Garibaldi 321, Torino', 'Italia', '+39 3332345678'),
(5, 'luca.ferrari@email.com', 'Luca Ferrari', 'Via Dante 654, Firenze', 'Via Dante 654, Firenze', 'Italia', '+39 3336789012');

-- =====================================================
-- INSERT DATA INTO STACKS
-- =====================================================

-- fare REPLACE INTO invece di INSERT
INSERT INTO `stacks` (`id`, `id_planet`, `name`, `price`, `stock`, `slug`, `title`, `description`) VALUES
(1, 1, 'Capanna spaziale', 19.99, 'disponibile', 'mercurio-suolo-piccolo', '50m² di terreno', 'Compra una piccola capanna spaziale su Mercurio!'),
(2, 1, 'Casa Spaziale', 49.99, 'disponibile', 'mercurio-suolo-medio', '100m² di terreno', 'Acquista una casa spaziale confortevole su Mercurio!'),
(3, 1, 'Villa Spaziale', 69.99, 'disponibile', 'mercurio-suolo-grande', '150m² di terreno', 'Ottieni una villa di lusso panoramica su Mercurio!'),

(1, 2, 'Capanna spaziale', 19.99, 'disponibile', 'venere-suolo-piccolo', '50m² di terreno', 'Compra una piccola capanna spaziale su venere!'),
(2, 2, 'Casa Spaziale', 49.99, 'disponibile', 'venere-suolo-medio', '100m² di terreno', 'Acquista una casa spaziale confortevole su venere!'),
(3, 2, 'Villa Spaziale', 69.99, 'disponibile', 'venere-suolo-grande', '150m² di terreno', 'Ottieni una villa di lusso panoramica su venere!'),

(4, 3, 'Capanna spaziale', 19.99, 'disponibile', 'Marte-suolo-piccolo', '50m² di terreno', 'Compra una piccola capanna spaziale su Marte!'),
(5, 3, 'Casa Spaziale', 49.99, 'disponibile', 'Marte-suolo-medio', '100m² di terreno', 'Acquista una casa spaziale confortevole su Marte!'),
(6, 3, 'Villa Spaziale', 69.99, 'disponibile', 'Marte-suolo-grande', '150m² di terreno', 'Ottieni una villa di lusso panoramica su Marte!'),

(7, 4, 'Capanna spaziale', 19.99, 'disponibile', 'Giove-suolo-piccolo', '50m² di terreno', 'Compra una piccola capanna spaziale su Giove!'),
(8, 4, 'Casa Spaziale', 49.99, 'disponibile', 'Giove-suolo-medio', '100m² di terreno', 'Acquista una casa spaziale confortevole su Giove!'),
(9, 4, 'Villa Spaziale', 69.99, 'disponibile', 'Giove-suolo-grande', '150m² di terreno', 'Ottieni una villa di lusso panoramica su Giove!'),

(10, 5, 'Capanna spaziale', 19.99, 'disponibile', 'Saturno-suolo-piccolo', '50m² di terreno', 'Compra una piccola capanna spaziale su Saturno!'),
(11, 5, 'Casa Spaziale', 49.99, 'disponibile', 'Saturno-suolo-medio', '100m² di terreno', 'Acquista una casa spaziale confortevole su Saturno!'),
(12, 5, 'Villa Spaziale', 69.99, 'disponibile', 'Saturno-suolo-grande', '150m² di terreno', 'Ottieni una villa di lusso panoramica su Saturno!'),

(13, 6, 'Capanna spaziale', 19.99, 'disponibile', 'Urano-suolo-piccolo', '50m² di terreno', 'Compra una piccola capanna spaziale su Urano!'),
(14, 6, 'Casa Spaziale', 49.99, 'disponibile', 'Urano-suolo-medio', '100m² di terreno', 'Acquista una casa spaziale confortevole su Urano!'),
(15, 6, 'Villa Spaziale', 69.99, 'disponibile', 'Urano-suolo-grande', '150m² di terreno', 'Ottieni una villa di lusso panoramica su Urano!'),

(16, 7, 'Capanna spaziale', 19.99, 'disponibile', 'Nettuno-suolo-piccolo', '50m² di terreno', 'Compra una piccola capanna spaziale su Nettuno!'),
(17, 7, 'Casa Spaziale', 49.99, 'disponibile', 'Nettuno-suolo-medio', '100m² di terreno', 'Acquista una casa spaziale confortevole su Nettuno!'),
(18, 7, 'Villa Spaziale', 69.99, 'disponibile', 'Nettuno-suolo-grande', '150m² di terreno', 'Ottieni una villa di lusso panoramica su Nettuno!');



SET FOREIGN_KEY_CHECKS=1;



