use employees_db;

INSERT INTO department
    (depName)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 90000, 1),
    ('Lead Engineer', 180000, 2),
    ('Software Engineer', 150000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 130000, 3),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Cosner', 4, 3),
    ('Kumar', 'Harold', 5, NULL),
    ('Malik', 'Derek', 6, 5),
    ('Sarah', 'Bedford', 7, NULL),
    ('Tom', 'Allen', 8, 7);
