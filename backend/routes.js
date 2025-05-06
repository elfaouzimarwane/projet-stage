const express = require('express');
const userController = require('./userController');
const db = require('./db');
const { verifyToken, isAdmin } = require('./authMiddleware'); // Import middleware
const router = express.Router();

// User registration route
router.post('/api/register', userController.registerUser);

// User login route
router.post('/api/login', userController.loginUser);


// Protected route to create users
router.post('/api/create-user', verifyToken, isAdmin, userController.createUser);

// Fetch all adherents without pagination
router.get('/api/adherents', (req, res) => {
  const sql = 'SELECT adherentNumber, cin, visitReason, createdAt FROM Adherent';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching adherents', details: err });
    }
    res.json(results);
  });
});

// Fetch all non-adherents with pagination
router.get('/api/non-adherents', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const sql = 'SELECT * FROM nonadherent LIMIT ? OFFSET ?';
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching non-adherents', details: err });
    }
    res.json(results);
  });
});

// Fetch all partenaires with pagination
router.get('/api/partenaires', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const sql = 'SELECT * FROM Partenaire LIMIT ? OFFSET ?';
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching partenaires', details: err });
    }
    res.json(results);
  });
});

// Add visitor route
router.post('/api/add-visitor', (req, res) => {
  const { visitorData, visitorType } = req.body;
  let sql, values;

  switch (visitorType) {
    case 'Partenaire':
      sql = 'INSERT INTO Partenaire (companyName, phone, partnershipType) VALUES (?, ?, ?)';
      values = [visitorData.companyName, visitorData.phone, visitorData.partnershipType];
      break;
    case 'NonAdherent':
      sql = 'INSERT INTO NonAdherent (nom, prenom, cin, ppr, phone, region, province, commune) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      values = [visitorData.nom, visitorData.prenom, visitorData.cin, visitorData.ppr, visitorData.phone, visitorData.region, visitorData.province, visitorData.commune];
      break;
    case 'Adherent':
      sql = 'INSERT INTO Adherent (adherentNumber, cin, visitReason) VALUES (?, ?, ?)';
      values = [visitorData.adherentNumber, visitorData.cin, visitorData.visitReason];
      break;
    default:
      return res.status(400).json({ error: 'Invalid visitor type' });
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding visitor', details: err.sqlMessage || err });
    }

    const visitorId = result.insertId;
    const visitorSql = 'INSERT INTO Visiteur (visitorId, visitorType) VALUES (?, ?)';
    db.query(visitorSql, [visitorId, visitorType], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error adding visitor to Visiteur table', details: err.sqlMessage || err });
      }
      res.json({ message: 'Visitor added successfully' });
    });
  });
});

// Search route
router.get('/api/search', (req, res) => {
  const query = req.query.query;

  const adherentQuery = `
    SELECT 'Adherent' AS type, adherentNumber, cin, visitReason, NULL AS nom, NULL AS prenom, NULL AS ppr, NULL AS phone, NULL AS province, NULL AS commune, NULL AS companyName, NULL AS partnershipType, createdAt
    FROM Adherent
    WHERE adherentNumber LIKE ? OR cin LIKE ?
  `;
  const nonAdherentQuery = `
    SELECT 'NonAdherent' AS type, NULL AS adherentNumber, NULL AS visitReason, nom, prenom, cin, ppr, phone, province, commune, NULL AS companyName, NULL AS partnershipType, createdAt
    FROM NonAdherent
    WHERE cin LIKE ? OR ppr LIKE ?
  `;
  const partenaireQuery = `
    SELECT 'Partenaire' AS type, NULL AS adherentNumber, NULL AS visitReason, NULL AS nom, NULL AS prenom, NULL AS cin, NULL AS ppr, phone, NULL AS province, NULL AS commune, companyName, partnershipType, createdAt
    FROM Partenaire
    WHERE companyName LIKE ?
  `;
  const values = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];

  db.query(adherentQuery, [values[0], values[1]], (err, adherentResults) => {
    if (err) {
      return res.status(500).json({ error: 'Error executing adherent query', details: err });
    }

    db.query(nonAdherentQuery, [values[2], values[3]], (err, nonAdherentResults) => {
      if (err) {
        return res.status(500).json({ error: 'Error executing non-adherent query', details: err });
      }

      db.query(partenaireQuery, [values[4]], (err, partenaireResults) => {
        if (err) {
          return res.status(500).json({ error: 'Error executing partenaire query', details: err });
        }

        const results = [...adherentResults, ...nonAdherentResults, ...partenaireResults];
        res.json(results);
      });
    });
  });
});

module.exports = router;