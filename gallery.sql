PRAGMA foreign_keys = ON;
CREATE TABLE artist (artist_id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, birthplace TEXT NOT NULL, birthdate TEXT NOT NULL CHECK (date(birthdate) IS birthdate), style TEXT NOT NULL);
CREATE TABLE artwork (artwork_id TEXT PRIMARY KEY NOT NULL, artist_id TEXT NOT NULL REFERENCES artist(artist_id), year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 9999), title TEXT NOT NULL, art_type TEXT NOT NULL CHECK (art_type IN ('Painting','Lithograph','Sculpture','Photography')), price_cop INTEGER NOT NULL CHECK (price_cop >= 0));
CREATE TABLE art_group (group_code TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL);
CREATE TABLE artwork_group (artwork_id TEXT NOT NULL REFERENCES artwork(artwork_id), group_code TEXT NOT NULL REFERENCES art_group(group_code), PRIMARY KEY(artwork_id, group_code));
CREATE TABLE customer (customer_id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(name))>0 AND trim(name)=name), address TEXT NOT NULL, total_spent_cop INTEGER NOT NULL CHECK (total_spent_cop >= 0));
CREATE TABLE customer_artist (customer_id TEXT NOT NULL REFERENCES customer(customer_id), artist_id TEXT NOT NULL REFERENCES artist(artist_id), PRIMARY KEY(customer_id, artist_id));
CREATE TABLE customer_group (customer_id TEXT NOT NULL REFERENCES customer(customer_id), group_code TEXT NOT NULL REFERENCES art_group(group_code), PRIMARY KEY(customer_id, group_code));
CREATE INDEX idx_artwork_artist ON artwork(artist_id);
CREATE INDEX idx_membership_group ON artwork_group(group_code);
CREATE INDEX idx_customer_artist_artist ON customer_artist(artist_id);
CREATE INDEX idx_customer_group_group ON customer_group(group_code);
INSERT INTO artist VALUES ('A01','Inés Vallejo','Bogotá, Colombia','1997-03-21','Geometric abstraction'),('A02','Lucía Pardo','Tunja, Colombia','1994-09-14','Documentary practice'),('A03','Mateo Niebla','Pasto, Colombia','1990-02-07','Minimalism');
INSERT INTO artwork VALUES ('W01','A01',2024,'Cordillera en rojo','Painting',2400000),('W02','A02',2025,'Luz de la sabana','Photography',800000),('W03','A03',2023,'Piedra en equilibrio','Sculpture',3100000),('W04','A01',2025,'Carta de viento','Lithograph',625000),('W05','A02',2026,'Después de la lluvia','Photography',920000),('W06','A03',2024,'Pliegue de la tierra','Sculpture',2800000);
INSERT INTO art_group VALUES ('AND','Andean landscapes'),('ABS','Abstraction'),('EDN','Editions');
INSERT INTO artwork_group VALUES ('W01','AND'),('W01','ABS'),('W02','AND'),('W03','ABS'),('W04','ABS'),('W04','EDN'),('W05','AND'),('W05','EDN');
INSERT INTO customer VALUES ('C01','Collector A','Demo address A (not a real location)',3200000),('C02','Collector B','Demo address B (not a real location)',0),('C03','Collector C','Demo address C (not a real location)',625000);
INSERT INTO customer_artist VALUES ('C01','A01'),('C01','A02'),('C02','A03');
INSERT INTO customer_group VALUES ('C01','AND'),('C01','EDN'),('C02','ABS'),('C03','EDN');
CREATE VIEW gallery_catalogue AS SELECT w.artwork_id,w.title,a.name AS artist,w.year,w.art_type,w.price_cop FROM artwork w JOIN artist a USING (artist_id);
CREATE VIEW group_inventory AS SELECT g.group_code,g.name,COUNT(ag.artwork_id) AS works FROM art_group g LEFT JOIN artwork_group ag USING (group_code) GROUP BY g.group_code,g.name;
CREATE VIEW customer_recommendations AS
SELECT c.customer_id,w.artwork_id,w.title,
 EXISTS(SELECT 1 FROM customer_artist ca WHERE ca.customer_id=c.customer_id AND ca.artist_id=w.artist_id) AS artist_match,
 EXISTS(SELECT 1 FROM artwork_group ag JOIN customer_group cg USING(group_code) WHERE ag.artwork_id=w.artwork_id AND cg.customer_id=c.customer_id) AS group_match
FROM customer c CROSS JOIN artwork w WHERE artist_match=1 OR group_match=1;
-- Examples: SELECT * FROM gallery_catalogue WHERE art_type='Photography' ORDER BY price_cop;
-- SELECT * FROM group_inventory ORDER BY group_code;
-- SELECT * FROM customer_recommendations WHERE customer_id='C01' ORDER BY artwork_id;
