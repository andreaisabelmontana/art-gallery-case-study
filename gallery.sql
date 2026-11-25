PRAGMA foreign_keys = ON;
CREATE TABLE artist (artist_id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, birthplace TEXT, birthdate TEXT CHECK (birthdate IS NULL OR date(birthdate) IS birthdate), style TEXT);
CREATE TABLE artwork (artwork_id TEXT PRIMARY KEY NOT NULL, artist_id TEXT NOT NULL REFERENCES artist(artist_id), year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 9999), title TEXT NOT NULL, art_type TEXT CHECK (art_type IN ('Painting','Drawing','Ceramic','Lithograph','Sculpture','Photography')), medium TEXT, price_cop INTEGER CHECK (price_cop >= 0), source_url TEXT NOT NULL, image_url TEXT NOT NULL);
CREATE TABLE art_group (group_code TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL);
CREATE TABLE artwork_group (artwork_id TEXT NOT NULL REFERENCES artwork(artwork_id), group_code TEXT NOT NULL REFERENCES art_group(group_code), provenance TEXT NOT NULL DEFAULT 'portfolio' CHECK (provenance IN ('portfolio','case-study')), PRIMARY KEY(artwork_id, group_code));
CREATE TABLE customer (customer_id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(name))>0 AND trim(name)=name), address TEXT NOT NULL, total_spent_cop INTEGER NOT NULL CHECK (total_spent_cop >= 0));
CREATE TABLE customer_artist (customer_id TEXT NOT NULL REFERENCES customer(customer_id), artist_id TEXT NOT NULL REFERENCES artist(artist_id), PRIMARY KEY(customer_id, artist_id));
CREATE TABLE customer_group (customer_id TEXT NOT NULL REFERENCES customer(customer_id), group_code TEXT NOT NULL REFERENCES art_group(group_code), PRIMARY KEY(customer_id, group_code));
CREATE INDEX idx_artwork_artist ON artwork(artist_id);
CREATE INDEX idx_membership_group ON artwork_group(group_code);
CREATE INDEX idx_customer_artist_artist ON customer_artist(artist_id);
CREATE INDEX idx_customer_group_group ON customer_group(group_code);
-- Public catalogue metadata sourced from https://andreamontana.com/design-art/
-- Prices, artist birthplace/birthdate/style are not sourced and are NULL.
INSERT INTO artist VALUES ('A01','Andrea Montaña',NULL,NULL,NULL);
INSERT INTO art_group VALUES ('places','Places & journeys'),('people','People & moments'),('creatures','Creatures & stories'),('objects','Objects & colour');
INSERT INTO artwork VALUES ('caracas-skyline','A01',2026,'Caracas Skyline','Painting','Watercolour',NULL,'https://andreamontana.com/design-art/#work-caracas-skyline','https://andreamontana.com/custom/design-art-assets/caracas-skyline-2026-watercolor-large.jpg');
INSERT INTO artwork_group VALUES ('caracas-skyline','places','portfolio');
INSERT INTO artwork VALUES ('shanghai','A01',2026,'Shanghai','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-shanghai','https://andreamontana.com/custom/design-art-assets/shanghai-2026-acrylic-medium.jpg');
INSERT INTO artwork_group VALUES ('shanghai','places','portfolio');
INSERT INTO artwork VALUES ('venezia','A01',2020,'Venezia','Painting','Oil',NULL,'https://andreamontana.com/design-art/#work-venezia','https://andreamontana.com/custom/design-art-assets/venezia-2020-oil-extralarge.jpg');
INSERT INTO artwork_group VALUES ('venezia','places','portfolio');
INSERT INTO artwork VALUES ('grocery','A01',2023,'Grocery','Drawing','Oil pastel',NULL,'https://andreamontana.com/design-art/#work-grocery','https://andreamontana.com/custom/design-art-assets/grocery-2023-oilpastel-medium.jpg');
INSERT INTO artwork_group VALUES ('grocery','creatures','portfolio');
INSERT INTO artwork VALUES ('colorin','A01',2021,'Colorín','Painting','Oil',NULL,'https://andreamontana.com/design-art/#work-colorin','https://andreamontana.com/custom/design-art-assets/colorin-2021-oil-large.jpg');
INSERT INTO artwork_group VALUES ('colorin','creatures','portfolio');
INSERT INTO artwork VALUES ('porto','A01',2025,'Porto','Ceramic','Ceramic',NULL,'https://andreamontana.com/design-art/#work-porto','https://andreamontana.com/custom/design-art-assets/porto-2025-ceramic-medium.jpg');
INSERT INTO artwork_group VALUES ('porto','objects','portfolio');
INSERT INTO artwork VALUES ('2000','A01',2026,'Two Thousand','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-2000','https://andreamontana.com/custom/design-art-assets/2000-2026-acrylic-large.jpg');
INSERT INTO artwork_group VALUES ('2000','places','portfolio');
INSERT INTO artwork VALUES ('angel','A01',2021,'Angel','Drawing','Pencil',NULL,'https://andreamontana.com/design-art/#work-angel','https://andreamontana.com/custom/design-art-assets/angel-2021-pencil-medium.jpg');
INSERT INTO artwork_group VALUES ('angel','people','portfolio');
INSERT INTO artwork VALUES ('barcelona','A01',2024,'Barcelona','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-barcelona','https://andreamontana.com/custom/design-art-assets/barcelona-2024-acrylic-large.jpg');
INSERT INTO artwork_group VALUES ('barcelona','places','portfolio');
INSERT INTO artwork VALUES ('bogota','A01',2026,'Bogota','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-bogota','https://andreamontana.com/custom/design-art-assets/bogota-2026-acrylic-large.jpg');
INSERT INTO artwork_group VALUES ('bogota','places','portfolio');
INSERT INTO artwork VALUES ('chamo','A01',2026,'Chamo','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-chamo','https://andreamontana.com/custom/design-art-assets/chamo-2026-acrylic-large.jpg');
INSERT INTO artwork_group VALUES ('chamo','creatures','portfolio');
INSERT INTO artwork VALUES ('feriado','A01',2025,'Feriado','Drawing','Pen',NULL,'https://andreamontana.com/design-art/#work-feriado','https://andreamontana.com/custom/design-art-assets/feriado-2025-pen-medium.jpg');
INSERT INTO artwork_group VALUES ('feriado','places','portfolio');
INSERT INTO artwork VALUES ('fleurs','A01',2026,'Fleurs','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-fleurs','https://andreamontana.com/custom/design-art-assets/fleurs-2026-acrylic-large.jpg');
INSERT INTO artwork_group VALUES ('fleurs','objects','portfolio');
INSERT INTO artwork VALUES ('ganado','A01',2026,'Ganado','Drawing','Pen',NULL,'https://andreamontana.com/design-art/#work-ganado','https://andreamontana.com/custom/design-art-assets/ganado-2026-pen-medium.jpg');
INSERT INTO artwork_group VALUES ('ganado','people','portfolio');
INSERT INTO artwork VALUES ('jazz','A01',2026,'Jazz','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-jazz','https://andreamontana.com/custom/design-art-assets/jazz-2026-acylic-medium.jpg');
INSERT INTO artwork_group VALUES ('jazz','creatures','portfolio');
INSERT INTO artwork VALUES ('ladybug','A01',2020,'Ladybug','Drawing','Colour pencil',NULL,'https://andreamontana.com/design-art/#work-ladybug','https://andreamontana.com/custom/design-art-assets/ladybug-2020-colorpencil-small.jpg');
INSERT INTO artwork_group VALUES ('ladybug','creatures','portfolio');
INSERT INTO artwork VALUES ('laia','A01',2020,'Laia','Drawing','Pencil',NULL,'https://andreamontana.com/design-art/#work-laia','https://andreamontana.com/custom/design-art-assets/laia-2020-pencil-medium.jpg');
INSERT INTO artwork_group VALUES ('laia','people','portfolio');
INSERT INTO artwork VALUES ('luck','A01',2021,'Luck','Drawing','Oil pastel',NULL,'https://andreamontana.com/design-art/#work-luck','https://andreamontana.com/custom/design-art-assets/luck-2021-oilpastel-medium.jpg');
INSERT INTO artwork_group VALUES ('luck','people','portfolio');
INSERT INTO artwork VALUES ('madrid','A01',2023,'Madrid','Drawing','Pen & highlighter',NULL,'https://andreamontana.com/design-art/#work-madrid','https://andreamontana.com/custom/design-art-assets/madrid-2023-penhighlighter-medium.jpg');
INSERT INTO artwork_group VALUES ('madrid','places','portfolio');
INSERT INTO artwork VALUES ('men','A01',2021,'Men','Drawing','Dry pastel',NULL,'https://andreamontana.com/design-art/#work-men','https://andreamontana.com/custom/design-art-assets/men-2021-drypastel-medium.jpg');
INSERT INTO artwork_group VALUES ('men','people','portfolio');
INSERT INTO artwork VALUES ('mimir','A01',2021,'Mimir','Drawing','Dry pastel',NULL,'https://andreamontana.com/design-art/#work-mimir','https://andreamontana.com/custom/design-art-assets/mimir-2021-drypastel-medium.jpg');
INSERT INTO artwork_group VALUES ('mimir','people','portfolio');
INSERT INTO artwork VALUES ('newspaper','A01',2021,'Newspaper','Drawing','Oil pastel',NULL,'https://andreamontana.com/design-art/#work-newspaper','https://andreamontana.com/custom/design-art-assets/newspaper-2021-oilpastel-medium.jpg');
INSERT INTO artwork_group VALUES ('newspaper','objects','portfolio');
INSERT INTO artwork VALUES ('peach','A01',2026,'Peach','Drawing','Alcohol marker',NULL,'https://andreamontana.com/design-art/#work-peach','https://andreamontana.com/custom/design-art-assets/peach-2026-alcohol-medium.jpg');
INSERT INTO artwork_group VALUES ('peach','creatures','portfolio');
INSERT INTO artwork VALUES ('pescadito','A01',2026,'Pescadito','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-pescadito','https://andreamontana.com/custom/design-art-assets/pescadito-2026-acrylic-medium.jpg');
INSERT INTO artwork_group VALUES ('pescadito','objects','portfolio');
INSERT INTO artwork VALUES ('portugal','A01',2022,'Portugal','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-portugal','https://andreamontana.com/custom/design-art-assets/portugal-2022-acylic-small.jpg');
INSERT INTO artwork_group VALUES ('portugal','places','portfolio');
INSERT INTO artwork VALUES ('run','A01',2026,'Run','Drawing','Alcohol marker',NULL,'https://andreamontana.com/design-art/#work-run','https://andreamontana.com/custom/design-art-assets/run-2026-alcohol-medium.jpg');
INSERT INTO artwork_group VALUES ('run','people','portfolio');
INSERT INTO artwork VALUES ('san-fransisco','A01',2022,'San Francisco','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-san-fransisco','https://andreamontana.com/custom/design-art-assets/san-fransisco-2022-acrylic-small.jpg');
INSERT INTO artwork_group VALUES ('san-fransisco','places','portfolio');
INSERT INTO artwork VALUES ('simona','A01',2026,'Simona',NULL,NULL,NULL,'https://andreamontana.com/design-art/#work-simona','https://andreamontana.com/custom/design-art-assets/simona-2026-acrylic-large.jpg');
INSERT INTO artwork_group VALUES ('simona','creatures','portfolio');
INSERT INTO artwork VALUES ('sloth','A01',2023,'Sloth','Painting','Acrylic',NULL,'https://andreamontana.com/design-art/#work-sloth','https://andreamontana.com/custom/design-art-assets/sloth-2023-acrylic-small.jpg');
INSERT INTO artwork_group VALUES ('sloth','creatures','portfolio');
INSERT INTO artwork VALUES ('tokyo','A01',2023,'Tokyo','Drawing','Pen',NULL,'https://andreamontana.com/design-art/#work-tokyo','https://andreamontana.com/custom/design-art-assets/tokyo-2023-pen-medium.jpg');
INSERT INTO artwork_group VALUES ('tokyo','places','portfolio');
INSERT INTO artwork VALUES ('vtech','A01',2026,'VTech','Drawing','Alcohol marker',NULL,'https://andreamontana.com/design-art/#work-vtech','https://andreamontana.com/custom/design-art-assets/vtech-2026-alcohol-medium.jpg');
INSERT INTO artwork_group VALUES ('vtech','people','portfolio');
INSERT INTO artwork VALUES ('zahra','A01',2023,'Zahra','Painting','Oil',NULL,'https://andreamontana.com/design-art/#work-zahra','https://andreamontana.com/custom/design-art-assets/zahra-2023-oil-medium.jpg');
INSERT INTO artwork_group VALUES ('zahra','creatures','portfolio');
-- Secondary tags are proposed by this case study, not existing portfolio memberships.
INSERT INTO artwork_group VALUES ('porto','creatures','case-study'),('san-fransisco','creatures','case-study'),('fleurs','people','case-study');
-- Collector identities, addresses, totals and likes below are classroom fixtures only.
INSERT INTO customer VALUES ('C01','Demo collector A','Synthetic address A',0),('C02','Demo collector B','Synthetic address B',750000),('C03','Demo collector C','Synthetic address C',0);
INSERT INTO customer_artist VALUES ('C01','A01');
INSERT INTO customer_group VALUES ('C01','places'),('C02','creatures'),('C03','objects'),('C03','people');
CREATE VIEW gallery_catalogue AS SELECT w.artwork_id,w.title,a.name AS artist,w.year,w.art_type,w.medium,w.price_cop FROM artwork w JOIN artist a USING (artist_id);
CREATE VIEW group_inventory AS SELECT g.group_code,g.name,COUNT(ag.artwork_id) AS works FROM art_group g LEFT JOIN artwork_group ag USING (group_code) GROUP BY g.group_code,g.name;
CREATE VIEW customer_recommendations AS
SELECT c.customer_id,w.artwork_id,w.title,
 EXISTS(SELECT 1 FROM customer_artist ca WHERE ca.customer_id=c.customer_id AND ca.artist_id=w.artist_id) AS artist_match,
 EXISTS(SELECT 1 FROM artwork_group ag JOIN customer_group cg USING(group_code) WHERE ag.artwork_id=w.artwork_id AND cg.customer_id=c.customer_id) AS group_match
FROM customer c CROSS JOIN artwork w WHERE artist_match=1 OR group_match=1;
-- Examples:
-- SELECT * FROM gallery_catalogue WHERE art_type='Painting' ORDER BY year, title;
-- SELECT * FROM group_inventory ORDER BY group_code;
-- SELECT * FROM customer_recommendations WHERE customer_id='C02' ORDER BY artwork_id;
