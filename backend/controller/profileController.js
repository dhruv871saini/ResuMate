import profileModel from "../model/profile.Model.js";
import { askJSON } from "../service/llmService.js";
import axios from "axios";
import { PDFExtract } from "pdf.js-extract";
import mammoth from "mammoth";

const pdfExtract = new PDFExtract();
const PARSE_RESUME_SYSTEM = `
You are a resume parser. Extract all information from the resume text provided.

Return ONLY valid JSON.

Ensure ALL fields exist even if empty.

Schema:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "summary": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "title": "",
      "start": "",
      "end": "",
      "bullets": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "year": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "tech": []
    }
  ],
  "achievements": []
}
`.trim();

/**
 * =========================
 * PROFILE CRUD
 * =========================
 */

export const createProfile = async (req, res) => {
  try {
    const { resume_data } = req.body;
    const userId = req.user.userId;

    if (!resume_data) {
      return res.status(400).json({ message: "resume_data is required" });
    }

    const profile = await profileModel.createProfile(userId, resume_data);

    return res.status(201).json({
      message: "Profile created",
      profile,
    });
  } catch (error) {
    console.error("createProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id, resume_data } = req.body;
    const userId = req.user.userId;

    if (!id || !resume_data) {
      return res
        .status(400)
        .json({ message: "id and resume_data are required" });
    }

    const profile = await profileModel.updateProfile(id, userId, resume_data);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found or not yours" });
    }

    return res.status(200).json({
      message: "Profile updated",
      profile,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const profile = await profileModel.getProfileById(id, userId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Profile fetched",
      profile,
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * RESUME PARSER (FIXED)
 * =========================
 */

export const parseResume = async (req, res) => {
  const { fileUrl, fileType } = req.body;

  if (!fileUrl) {
    return res.status(400).json({ message: "fileUrl is required" });
  }

  try {
    console.log("[ParseResume] Downloading:", fileUrl);

    const cleanUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");

    const response = await axios.get(cleanUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
      maxRedirects: 5,
      headers: {
        Accept: "*/*",
      },
    });

    const buffer = Buffer.from(response.data);

    console.log("[ParseResume] File size:", buffer.length);

    let rawText = "";

    const isPDF =
      fileType === "application/pdf" ||
      fileUrl.toLowerCase().includes(".pdf");

    const isDOCX =
      fileType?.includes("wordprocessingml") ||
      fileUrl.toLowerCase().includes(".docx");

    /**
     * =========================
     * PDF PARSING (FIXED)
     * =========================
     */
    if (isPDF) {
      console.log("[ParseResume] Parsing PDF...");

const result = await pdfExtract.extractBuffer(buffer, {});

 rawText = result.pages
  .map(page => page.content.map(item => item.str).join(" "))
  .join("\n");

    }

    /**
     * =========================
     * DOCX PARSING
     * =========================
     */
    else if (isDOCX) {
      console.log("[ParseResume] Parsing DOCX...");
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || "";
    }

    /**
     * =========================
     * FALLBACK
     * =========================
     */
    else {
      try {
  
const result = await pdfExtract.extractBuffer(buffer, {});

 rawText = result.pages
  .map(page => page.content.map(item => item.str).join(" "))
  .join("\n");

      } catch (e) {
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value || "";
      }
    }

    console.log("[ParseResume] Text length:", rawText.length);

    if (!rawText || rawText.trim().length < 50) {
      return res.status(422).json({
        message: "Could not extract text. Upload a proper PDF/DOCX.",
      });
    }

    console.log("[ParseResume] Sending to AI...");

    const { data: resume_data } = await askJSON(
      PARSE_RESUME_SYSTEM,
      `Resume text:\n${rawText.slice(0, 8000)}`
    );

    console.log("[ParseResume] AI parsing complete.");

    return res.status(200).json({
      message: "Resume parsed successfully",
      resume_data,
    });
  } catch (error) {
    console.error("[ParseResume] Error:", error);

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        message: "Download timeout. Check file URL.",
      });
    }

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "File not found at URL.",
      });
    }

    return res.status(500).json({
      message: error.message || "Failed to parse resume",
    });
  }
};