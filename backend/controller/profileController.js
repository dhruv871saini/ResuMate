import profileModel from "../model/profile.Model.js";
import { askJSON } from "../service/llmService.js";
import axios from "axios";
import * as pdfParse from 'pdf-parse';
import mammoth from "mammoth";

const PARSE_RESUME_SYSTEM = `
You are a resume parser. Extract all information from the resume text provided.
Return ONLY valid JSON, no markdown, no explanation.
 
Schema:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "title": "string",
      "start": "string",
      "end": "string",
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "year": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "tech": ["string"]
    }
  ],
  "achievements": ["string"]
}
`.trim();

export const createProfile = async (req, res) => {
  try {
    const { resume_data } = req.body;
    const userId = req.user.userId;

    if (!resume_data) {
      return res.status(400).json({ message: "resume_data is required" });
    }

    const profile = await profileModel.createProfile(userId, resume_data);
    res.status(201).json({ message: "Profile created", profile });
  } catch (error) {
    console.error("Error in createProfile:", error);
    res.status(500).json({ message: "Server error" });
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
      return res
        .status(404)
        .json({ message: "Profile not found or not yours" });
    }

    res.status(200).json({ message: "Profile updated", profile });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Server error" });
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

    res.status(200).json({ message: "Profile fetched", profile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const parseResume = async (req, res) => {
  const { fileUrl, fileType } = req.body;

  if (!fileUrl) return res.status(400).json({ message: "fileUrl is required" });

  try {
    console.log("[ParseResume] Downloading from Cloudinary:", fileUrl);

    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });
    const buffer = Buffer.from(response.data);

    let rawText = "";

    const isPDF =
      fileType === "application/pdf" || fileUrl.toLowerCase().includes(".pdf");
    const isDOCX =
      fileType?.includes("wordprocessingml") ||
      fileUrl.toLowerCase().includes(".docx");

    if (isPDF) {
      console.log("[ParseResume] Extracting text from PDF...");
      const data = await pdfParse(buffer);
      rawText = data.text;
    } else if (isDOCX) {
      console.log("[ParseResume] Extracting text from DOCX...");
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    } else {
      try {
        const data = await pdfParse(buffer);
        rawText = data.text;
      } catch {
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value;
      }
    }

    if (!rawText || rawText.trim().length < 50) {
      return res.status(422).json({
        message:
          "Could not extract text from this file. Try uploading a text-based PDF or DOCX.",
      });
    }

    console.log(
      `[ParseResume] Extracted ${rawText.length} chars. Sending to AI...`,
    );

    const { data: resume_data } = await askJSON(
      PARSE_RESUME_SYSTEM,
      `Resume text:\n${rawText.slice(0, 8000)}`,
    );

    console.log("[ParseResume] AI parsing complete.");

    return res.status(200).json({
      message: "Resume parsed successfully",
      resume_data,
    });
  } catch (error) {
    console.error("[ParseResume] Error:", error.message);

    if (error.code === "ECONNABORTED") {
      return res
        .status(504)
        .json({ message: "Download timed out. Check the file URL." });
    }
    if (error.response?.status === 404) {
      return res
        .status(404)
        .json({ message: "File not found at the provided URL." });
    }

    return res
      .status(500)
      .json({ message: error.message || "Failed to parse resume" });
  }
};
