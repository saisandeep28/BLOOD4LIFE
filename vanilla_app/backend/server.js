/**
 * BLOOD4LIFE - Node.js Express REST API Server
 * Integrated with Oracle Database & Advanced PL/SQL Packages
 */

const express = require('express');
const path = require('path');
let oracledb;

try {
  oracledb = require('oracledb');
} catch (err) {
  console.log('oracle-db driver note: Optional node-oracledb module can be installed via npm install oracledb');
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Oracle Database Connection Pool Configuration
const dbConfig = {
  user: process.env.ORACLE_USER || 'system',
  password: process.env.ORACLE_PASSWORD || 'oracle',
  connectString: process.env.ORACLE_CONN_STR || 'localhost:1521/FREEPDB1'
};

// Initialize Connection Pool
async function initOraclePool() {
  if (!oracledb) return;
  try {
    await oracledb.createPool(dbConfig);
    console.log('✅ Oracle Database Connection Pool Initialized Successfully.');
  } catch (err) {
    console.log('⚠️ Oracle Database offline/pending credentials:', err.message);
  }
}

// 1. REST Endpoint: Submit Quiz Eligibility -> Calls PL/SQL `PKG_BLOOD_DONATION.SP_CHECK_ELIGIBILITY`
app.post('/api/eligibility/submit', async (req, res) => {
  const { answers, score } = req.body;

  if (!oracledb) {
    return res.json({ status: 'SUCCESS_STANDALONE', score, message: 'Logged in standalone mode' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `BEGIN
         PKG_BLOOD_DONATION.SP_CHECK_ELIGIBILITY(
           p_session_id    => :sessionId,
           p_health_score  => :score,
           p_answers_json  => :answersJson,
           p_eligible_flag => :eligibleFlag,
           p_status_msg    => :statusMsg
         );
       END;`,
      {
        sessionId: 'SESSION_' + Date.now(),
        score: score,
        answersJson: JSON.stringify(answers),
        eligibleFlag: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 5 },
        statusMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 }
      }
    );

    res.json({
      status: 'SUCCESS',
      eligible: result.outBinds.eligibleFlag === 'Y',
      message: result.outBinds.statusMsg
    });
  } catch (err) {
    console.error('Oracle DB Error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) {}
    }
  }
});

// 2. REST Endpoint: Get Statewide AP Stats -> Calls PL/SQL `PKG_BLOOD_DONATION.SP_GET_STATE_STATS`
app.get('/api/stats/ap', async (req, res) => {
  if (!oracledb) {
    return res.json({ totalDonors: 95124, totalCenters: 240, upcomingCamps: 9, campsOrganised: 10044 });
  }

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `BEGIN PKG_BLOOD_DONATION.SP_GET_STATE_STATS(:cursor); END;`,
      {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows(1);
    await resultSet.close();

    res.json({
      totalDonors: rows[0][0],
      totalCenters: rows[0][1],
      upcomingCamps: rows[0][2],
      campsOrganised: rows[0][3]
    });
  } catch (err) {
    res.json({ totalDonors: 95124, totalCenters: 240, upcomingCamps: 9, campsOrganised: 10044 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) {}
    }
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 BLOOD4LIFE Vanilla App & Oracle REST API running on http://localhost:${PORT}`);
  initOraclePool();
});
