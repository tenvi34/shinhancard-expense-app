const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  const expenses = jsonData.map(row => ({
    date: row['승인일자'] || row['Date'],
    store: row['이용가맹점명'] || row['Store'],
    amount: parseInt(String(row['이용금액'] || row['Amount']).replace(/[^0-9]/g, '')) || 0
  }));

  fs.unlinkSync(filePath); // 업로드 파일 삭제

  res.json(expenses);
});

app.listen(3000, () => {
  console.log('✅ 백엔드 서버 실행 중: http://localhost:3000');
});
