const db = require('../config/connection');

function viewAllEmployees() {
    const query = `SELECT
    e.id,
    e.first_name,
    e.last_name,
    r.title,
    d.name AS department,
    r.salary,
    CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM
    employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id`;
    db.query(query, (err, results) => {
        err ? console.error(err) : console.table(results);
    });
};

function addEmployee(firstName, lastName, roleTitle, managerName) {
    const roleQuery = 'SELECT id FROM role WHERE title = ?';
    const roleValue = [roleTitle];
    db.query(roleQuery, roleValue, (roleErr, roleResults) => {
        if (roleErr) {
            console.error(roleErr);
        } else {
            console.log(roleResults);
            const roleId = roleResults[0].id;
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const values = [firstName, lastName, roleId, managerName];
            db.query(query, values, (err, results) => {
                err ? console.error(err) : console.log(`Successfully added ${firstName} ${lastName} as an employee.`);
            });
        }
    });
};

function getRoles() {
    return db.promise().query('SELECT title FROM role')
        .then(results => {
            const roleChoices = results[0].map(result => result.title);
            return roleChoices;
        })
        .catch(err => {
            console.error(err);
        });
};

function getManagers() {
    return db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employee WHERE manager_id IS NULL')
        .then(results => {
            const managerChoices = results[0].map(result => ({ name: result.manager, value: result.id }));
            return managerChoices;
        })
        .catch(err => {
            console.error(err);
        });
};

module.exports = {
    viewAllEmployees,
    addEmployee,
    getRoles,
    getManagers
}
