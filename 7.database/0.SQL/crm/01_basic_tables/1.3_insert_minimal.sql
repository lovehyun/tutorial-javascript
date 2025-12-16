-- 목적: INSERT 패턴(1건/여러건)
INSERT INTO users VALUES ('U1','Kim'), ('U2','Lee');
INSERT INTO stores VALUES ('S1','Gangnam Store');
INSERT INTO items VALUES ('I1','Gimbap',3500), ('I2','Tteokbokki',4500);

INSERT INTO orders VALUES ('O1','2025-12-01 12:00:00','S1','U1');
INSERT INTO orderitems VALUES ('OI1','O1','I1',2), ('OI2','O1','I2',1);
