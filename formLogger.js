const fs = require('fs');
const path = require('path');

class FormLogger {
  constructor(logFilePath) {
    this.logFilePath = logFilePath || path.join(__dirname, 'form_submissions.log');
  }

  logFormSubmission(data) {
    const { ign, age, gender, steamhex, userId } = data;
    const timestamp = new Date().toISOString();

    // สร้างข้อความ log แบบมีรูปแบบ JSON แต่เป็นบรรทัดเดียวเพื่อความอ่านง่าย
    const logEntry = JSON.stringify({
      timestamp,
      userId,
      ign,
      age,
      gender,
      steamhex
    }) + '\n';

    fs.appendFile(this.logFilePath, logEntry, (err) => {
      if (err) {
        console.error('❌ ไม่สามารถบันทึก log ฟอร์มได้:', err);
      }
    });
  }
}

module.exports = FormLogger;

// Jimmy Lionez