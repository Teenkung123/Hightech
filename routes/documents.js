const express = require('express');
const router = express.Router();
const Document = require('../models/document'); // เรียกใช้งานโมเดล Document
const path = require('path');
const fs = require('fs');

// GET เอกสารทั้งหมด
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST เพิ่มเอกสารใหม่
router.post('/', async (req, res) => {
    const document = new Document({
        topic: req.body.topic,
        writer: req.body.writer,
        content: req.body.content
    });
    try {
        const newDocument = await document.save();
        res.status(201).json(newDocument); // ส่งข้อมูลใหม่กลับไป
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (อัปเดต) เอกสารตาม ID
router.put('/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });

        // อัปเดตเอกสาร
        document.topic = req.body.topic || document.topic;
        document.writer = req.body.writer || document.writer;
        document.content = req.body.content || document.content;

        const updatedDocument = await document.save();
        res.json(updatedDocument); // ส่งข้อมูลใหม่กลับไปหลังจากการอัปเดตสำเร็จ
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE เอกสารตาม ID
router.delete('/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });

        await Document.deleteOne({ _id: req.params.id }); // ลบเอกสาร
        res.json({ message: 'Document deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route สำหรับดาวน์โหลดเอกสาร
router.get('/download/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });

        // ตรวจสอบว่าโฟลเดอร์ downloads มีอยู่หรือไม่
        const downloadsDir = path.join(__dirname, '../downloads');
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir); // สร้างโฟลเดอร์ถ้ายังไม่มี
        }

        // สร้างไฟล์ชั่วคราวจากเนื้อหาเอกสารเพื่อให้ดาวน์โหลด
        const filePath = path.join(downloadsDir, `${document._id}.txt`);
        const fileContent = `Topic: ${document.topic}\nWriter: ${document.writer}\nContent: ${document.content}`;
        
        // เขียนเนื้อหาเอกสารลงในไฟล์
        fs.writeFileSync(filePath, fileContent);

        // ส่งไฟล์ให้กับผู้ใช้เพื่อดาวน์โหลด
        res.download(filePath, `${document.topic}.txt`, (err) => {
            if (err) {
                res.status(500).json({ message: 'Failed to download document' });
            }
            // ลบไฟล์ชั่วคราวหลังจากส่งให้ผู้ใช้แล้ว
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to download document', error: err.message });
    }
});

module.exports = router;
