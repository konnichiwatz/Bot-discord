// Jimmy Lionez

const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

class Logger {
  constructor(client, channelId, logFilePath) {
    this.client = client;
    this.channelId = channelId;
    this.logFilePath = logFilePath || path.join(__dirname, 'bot.log');
  }

  // ฟังก์ชันช่วยเขียน log ลงไฟล์
  writeLogToFile(logEntry) {
    fs.appendFile(this.logFilePath, logEntry + '\n', (err) => {
      if (err) {
        console.error('❌ ไม่สามารถบันทึก log ลงไฟล์ได้:', err);
      }
    });
  }

  async sendStartupMessage() {
    try {
      const message = `🟢 บอท ${this.client.user.tag} เริ่มทำงานเรียบร้อยแล้ว`;
      console.log(message);
      this.writeLogToFile(`[STARTUP] ${new Date().toISOString()} - ${message}`);
    } catch (err) {
      console.error('❌ ไม่สามารถแจ้งเตือนเริ่มทำงานได้:', err);
    }
  }

  async sendErrorMessage(error, title = 'เกิดข้อผิดพลาด') {
    try {
      const message = `❌ ${title}: ${error}`;
      console.error(message);
      this.writeLogToFile(`[ERROR] ${new Date().toISOString()} - ${message}`);
    } catch (err) {
      console.error('❌ ไม่สามารถแจ้ง Error ได้:', err);
    }
  }

  async sendInfoMessage(message) {
    try {
      const logMessage = `ℹ️ ข้อมูล: ${message}`;
      console.log(logMessage);
      this.writeLogToFile(`[INFO] ${new Date().toISOString()} - ${logMessage}`);
    } catch (err) {
      console.error('❌ ไม่สามารถแจ้งข้อมูลได้:', err);
    }
  }

  // ฟังก์ชัน log กรณีมีคนกรอกข้อมูล (ไม่ส่งข้อความ Discord)
  logFormSubmission(data) {
    const { ign, age, gender, steamhex, userId } = data;
    const logEntry = `[FORM SUBMISSION] ${new Date().toISOString()} - UserID: ${userId}, IGN: ${ign}, Age: ${age}, Gender: ${gender}, SteamHEX: ${steamhex}`;
    console.log(logEntry);
    this.writeLogToFile(logEntry);
  }

  // Jimmy Lionez
  // ฟังก์ชันสำหรับ log ใน console แยกต่างหาก (ไม่ส่งเข้า Discord)
  sendLocalLog(message) {
    const logEntry = `[LOCAL LOG] ${new Date().toISOString()} - ${message}`;
    console.log(logEntry);
    this.writeLogToFile(logEntry);
  }

  sendLocalError(title, error) {
    const logEntry = `[LOCAL ERROR] ${new Date().toISOString()} - ${title} - ${error}`;
    console.error(logEntry);
    this.writeLogToFile(logEntry);
  }
}

module.exports = Logger;

// Jimmy Lionez