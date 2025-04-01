DROP TABLE IF EXISTS fruit CASCADE;

CREATE TABLE fruit (
     id INT NOT NULL,
     description VARCHAR(255),
     name VARCHAR(255),
     score CHAR(1) NOT NULL,
     version INT,
     PRIMARY KEY (id)
);

INSERT INTO fruit (id, description, name, score, version)
VALUES 
(1, 'A round fruit', 'Apple', 'A', 1),
(2, 'A yellow fruit', 'Banana', 'B', 1);
