create database bank;
use bank;
CREATE TABLE bank (
  code INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  address VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into bank(name,address,created_at) 
value ("city bank","Itanagar, Arunachal Pradesh,791113",NOW());
select * from bank;

CREATE TABLE branch (
  branch_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zipcode VARCHAR(10) NOT NULL,
  bank_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bank_id) REFERENCES bank(code)
);

CREATE TABLE customer (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
alter table customer add column email varchar(100) not null;
ALTER TABLE customer
ADD COLUMN password VARCHAR(255) NOT NULL;



CREATE TABLE phone (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  phone_number VARCHAR(10) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE account (
  account_id INT AUTO_INCREMENT PRIMARY KEY,
  account_number VARCHAR(20) NOT NULL,
  account_type VARCHAR(50) NOT NULL,
  balance DECIMAL(10, 2) NOT NULL,
  customer_id INT NOT NULL,
  branch_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

CREATE TABLE loan (
  loan_id INT AUTO_INCREMENT PRIMARY KEY,
  loan_amount DECIMAL(10, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  customer_id INT NOT NULL,
  branch_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

CREATE TABLE transaction (
transaction_id INT PRIMARY KEY AUTO_INCREMENT,
sender INT NOT NULL,
receiver INT NOT NULL,
amount DECIMAL(10,2) NOT NULL,
FOREIGN KEY(sender) REFERENCES account(account_id),
FOREIGN KEY(receiver) REFERENCES account(account_id)
);