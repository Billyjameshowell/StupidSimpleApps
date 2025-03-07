import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // API route to handle contact form submissions
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body against the schema
      const contactData = insertContactSchema.parse(req.body);
      
      // Store the contact submission
      const submission = await storage.createContactSubmission(contactData);
      
      // Return the created submission
      res.status(201).json({ 
        success: true,
        data: submission
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          error: validationError.message 
        });
      } else {
        // Handle other errors
        console.error("Error handling contact submission:", error);
        res.status(500).json({ 
          success: false, 
          error: "Failed to process your submission. Please try again later." 
        });
      }
    }
  });

  // API route to get all contact submissions (could be used for an admin panel)
  app.get("/api/contact", async (_req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json({ 
        success: true,
        data: submissions 
      });
    } catch (error) {
      console.error("Error retrieving contact submissions:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to retrieve submissions." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
