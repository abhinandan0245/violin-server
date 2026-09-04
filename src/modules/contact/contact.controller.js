// // src/modules/contact/contact.controller.js
// const ContactService = require("./contact.service");
// const nodemailer = require("nodemailer");

// // Email transporter configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// class ContactController {
//   // Get all inquiries (Admin only)
//   static async getAll(req, res) {
//     try {
//       console.log("📥 GET /contacts - Query:", req.query);

//       const result = await ContactService.getAll(req.query);

//       console.log(`✅ Found ${result.items.length} contacts`);

//       res.status(200).json({
//         success: true,
//         data: result,
//       });
//     } catch (error) {
//       console.error("❌ Error in getAll:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Get contact statistics (Admin only)
//   static async getStats(req, res) {
//     try {
//       const stats = await ContactService.getStats();
//       res.status(200).json({
//         success: true,
//         data: stats,
//       });
//     } catch (error) {
//       console.error("❌ Error in getStats:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Get single inquiry (Admin only)
//   static async getById(req, res) {
//     try {
//       const item = await ContactService.getById(req.params.id);
//       if (!item) {
//         return res.status(404).json({
//           success: false,
//           message: "Inquiry not found",
//         });
//       }
//       res.status(200).json({
//         success: true,
//         data: item,
//       });
//     } catch (error) {
//       console.error("❌ Error in getById:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Create a new contact inquiry (Public)
//   static async create(req, res) {
//     try {
//       const data = req.body;

//       // Validate required fields
//       const requiredFields = ["name", "email", "phone", "message"];
//       const missingFields = requiredFields.filter((field) => !data[field]);

//       if (missingFields.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: `Missing required fields: ${missingFields.join(", ")}`,
//         });
//       }

//       // Create inquiry
//       const inquiry = await ContactService.create(data);

//       // ✅ Try to send emails but don't fail if they don't work
//       try {
//         await ContactController.sendAdminEmail(inquiry);
//         await ContactController.sendUserEmail(inquiry);
//       } catch (emailError) {
//         console.error(
//           "⚠️ Email error (but inquiry was saved):",
//           emailError.message,
//         );
//         // Don't return error - just log it
//       }

//       res.status(201).json({
//         success: true,
//         message: "Inquiry submitted successfully! We'll get back to you soon.",
//         data: inquiry,
//       });
//     } catch (error) {
//       console.error("❌ Error creating inquiry:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message || "Failed to submit inquiry",
//       });
//     }
//   }

//   // Update inquiry status (Admin only)
//   static async update(req, res) {
//     try {
//       const existingItem = await ContactService.getById(req.params.id);

//       if (!existingItem) {
//         return res.status(404).json({
//           success: false,
//           message: "Inquiry not found",
//         });
//       }

//       const data = req.body;
//       const item = await ContactService.update(req.params.id, data);

//       res.status(200).json({
//         success: true,
//         message: "Inquiry updated successfully",
//         data: item,
//       });
//     } catch (error) {
//       console.error("❌ Error in update:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Delete inquiry (Admin only)
//   static async delete(req, res) {
//     try {
//       const item = await ContactService.getById(req.params.id);

//       if (!item) {
//         return res.status(404).json({
//           success: false,
//           message: "Inquiry not found",
//         });
//       }

//       await ContactService.delete(req.params.id);

//       res.status(200).json({
//         success: true,
//         message: "Inquiry deleted successfully",
//       });
//     } catch (error) {
//       console.error("❌ Error in delete:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // Send email to admin
//   static async sendAdminEmail(inquiry) {
//     try {
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
//         subject: `New Contact Inquiry from ${inquiry.name}`,
//         html: `
//           <h2>New Contact Inquiry</h2>
//           <p><strong>Name:</strong> ${inquiry.name}</p>
//           <p><strong>Email:</strong> ${inquiry.email}</p>
//           <p><strong>Phone:</strong> ${inquiry.phone}</p>
//           ${inquiry.guests ? `<p><strong>Guests:</strong> ${inquiry.guests}</p>` : ""}
//           ${inquiry.venueName ? `<p><strong>Venue Name:</strong> ${inquiry.venueName}</p>` : ""}
//           ${inquiry.country ? `<p><strong>Country:</strong> ${inquiry.country}</p>` : ""}
//           ${inquiry.state ? `<p><strong>State:</strong> ${inquiry.state}</p>` : ""}
//           ${inquiry.city ? `<p><strong>City:</strong> ${inquiry.city}</p>` : ""}
//           ${inquiry.category ? `<p><strong>Category:</strong> ${inquiry.category}</p>` : ""}
//           ${inquiry.celebrationType ? `<p><strong>Celebration Type:</strong> ${inquiry.celebrationType}</p>` : ""}
//           <p><strong>Message:</strong></p>
//           <p>${inquiry.message}</p>
//           <hr>
//           <p><strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
//           <p><a href="${process.env.FRONTEND_URL}/admin/contacts/${inquiry._id}">View in Admin Panel</a></p>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//       console.log("✅ Admin email sent successfully");
//     } catch (error) {
//       console.error("❌ Error sending admin email:", error);
//       throw error;
//     }
//   }

//   // Send auto-reply to user
//   static async sendUserEmail(inquiry) {
//     try {
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: inquiry.email,
//         subject: "We've received your inquiry - Violin Events LLP",
//         html: `
//           <h2>Thank You for Contacting Violin Events LLP</h2>
//           <p>Dear ${inquiry.name},</p>
//           <p>Thank you for reaching out to us. We have received your inquiry and our team will get back to you within 24 hours.</p>
//           <p><strong>Your inquiry details:</strong></p>
//           <p><strong>Name:</strong> ${inquiry.name}</p>
//           <p><strong>Email:</strong> ${inquiry.email}</p>
//           <p><strong>Phone:</strong> ${inquiry.phone}</p>
//           ${inquiry.guests ? `<p><strong>Guests:</strong> ${inquiry.guests}</p>` : ""}
//           ${inquiry.venueName ? `<p><strong>Venue Name:</strong> ${inquiry.venueName}</p>` : ""}
//           ${inquiry.country ? `<p><strong>Country:</strong> ${inquiry.country}</p>` : ""}
//           ${inquiry.state ? `<p><strong>State:</strong> ${inquiry.state}</p>` : ""}
//           ${inquiry.city ? `<p><strong>City:</strong> ${inquiry.city}</p>` : ""}
//           ${inquiry.category ? `<p><strong>Category:</strong> ${inquiry.category}</p>` : ""}
//           ${inquiry.celebrationType ? `<p><strong>Celebration Type:</strong> ${inquiry.celebrationType}</p>` : ""}
//           <p><strong>Message:</strong></p>
//           <p>${inquiry.message}</p>
//           <hr>
//           <p>If you have any urgent questions, feel free to call us at <strong>+91 98765 43210</strong></p>
//           <p>Warm regards,<br><strong>Team Violin Events</strong></p>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//       console.log("✅ User auto-reply email sent successfully");
//     } catch (error) {
//       console.error("❌ Error sending user email:", error);
//       throw error;
//     }
//   }
// }

// module.exports = ContactController;


// src/modules/contact/contact.controller.js
const ContactService = require("./contact.service");
const nodemailer = require("nodemailer");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class ContactController {
  // Get all inquiries (Admin only)
  static async getAll(req, res) {
    try {
      const result = await ContactService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get contact statistics (Admin only)
  static async getStats(req, res) {
    try {
      const stats = await ContactService.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get single inquiry (Admin only)
  static async getById(req, res) {
    try {
      const item = await ContactService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Create a new contact inquiry (Public)
  static async create(req, res) {
    try {
      const payload = req.body;

      // 1. Validate required user fields
      if (!payload.user || !payload.user.fullName || !payload.user.email || !payload.user.phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Missing required user details (Full Name, Email, or Phone Number).",
        });
      }

      // 2. Validate that at least one enquiry section was submitted
      if (!payload.enquiries || Object.keys(payload.enquiries).length === 0) {
        return res.status(400).json({
          success: false,
          message: "You must submit at least one enquiry type.",
        });
      }

      // 3. Automatically populate the enquiryTypes array based on what was submitted
      payload.enquiryTypes = Object.keys(payload.enquiries);

      // 4. Create inquiry in database
      const inquiry = await ContactService.create(payload);

      // 5. Try to send emails
      try {
        await ContactController.sendAdminEmail(inquiry);
        await ContactController.sendUserEmail(inquiry);
      } catch (emailError) {
        console.error("⚠️ Email error (but inquiry was saved):", emailError.message);
      }

      res.status(201).json({
        success: true,
        message: "Inquiry submitted successfully! We'll get back to you soon.",
        data: inquiry,
      });
    } catch (error) {
      console.error("❌ Error creating inquiry:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to submit inquiry",
      });
    }
  }

  // Update inquiry status (Admin only)
  static async update(req, res) {
    try {
      const data = req.body;
      const item = await ContactService.update(req.params.id, data);
      
      if (!item) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }

      res.status(200).json({ success: true, message: "Inquiry updated successfully", data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete inquiry (Admin only)
  static async delete(req, res) {
    try {
      const item = await ContactService.delete(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Helper method to generate dynamic HTML based on submitted sections
  static generateDynamicEmailHTML(inquiry) {
    let html = `
      <h3>User Details</h3>
      <p><strong>Name:</strong> ${inquiry.user.fullName}</p>
      <p><strong>Email:</strong> ${inquiry.user.email}</p>
      <p><strong>Phone:</strong> ${inquiry.user.phoneNumber}</p>
      <hr>
      <h3>Enquiry Details (${inquiry.enquiryTypes.join(', ').toUpperCase()})</h3>
    `;

    if (inquiry.enquiries.general) {
      html += `
        <h4>💬 General Enquiry</h4>
        <p>${inquiry.enquiries.general.comment}</p>
      `;
    }

    if (inquiry.enquiries.venue) {
      const v = inquiry.enquiries.venue;
      html += `
        <h4>🏛️ Venue Booking</h4>
        <p><strong>Country:</strong> ${v.country || 'N/A'}</p>
        <p><strong>State:</strong> ${v.state || 'N/A'}</p>
        <p><strong>City:</strong> ${v.city || 'N/A'}</p>
        <p><strong>Venue:</strong> ${v.venueName || 'N/A'}</p>
        <p><strong>Date:</strong> ${v.bookingDate ? new Date(v.bookingDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Details:</strong> ${v.additionalDetails || 'N/A'}</p>
      `;
    }

    if (inquiry.enquiries.artist) {
      const a = inquiry.enquiries.artist;
      html += `
        <h4>🎤 Artist Booking</h4>
        <p><strong>Event Type:</strong> ${a.eventType || 'N/A'}</p>
        <p><strong>Date:</strong> ${a.eventDate ? new Date(a.eventDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Category:</strong> ${a.categoryName || 'N/A'}</p>
        <p><strong>Details:</strong> ${a.additionalDetails || 'N/A'}</p>
      `;
    }

    if (inquiry.enquiries.event) {
      const e = inquiry.enquiries.event;
      html += `
        <h4>📅 Event Planning</h4>
        <p><strong>Event Type:</strong> ${e.eventType || 'N/A'}</p>
        <p><strong>Date:</strong> ${e.eventDate ? new Date(e.eventDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Guests:</strong> ${e.guestCount || 'N/A'}</p>
        <p><strong>Location:</strong> ${e.location || 'N/A'}</p>
        <p><strong>Budget:</strong> ${e.budgetRange || 'N/A'}</p>
        <p><strong>Details:</strong> ${e.additionalDetails || 'N/A'}</p>
      `;
    }

    return html;
  }

  // Send email to admin
  static async sendAdminEmail(inquiry) {
    try {
      const dynamicContent = ContactController.generateDynamicEmailHTML(inquiry);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Contact Inquiry from ${inquiry.user.fullName}`,
        html: `
          <h2>New Contact Inquiry</h2>
          ${dynamicContent}
          <hr>
          <p><strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
          <p><a href="${process.env.FRONTEND_URL}/admin/contacts/${inquiry._id}">View in Admin Panel</a></p>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  // Send auto-reply to user
  static async sendUserEmail(inquiry) {
    try {
      const dynamicContent = ContactController.generateDynamicEmailHTML(inquiry);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: inquiry.user.email,
        subject: "We've received your inquiry - Violin Events LLP",
        html: `
          <h2>Thank You for Contacting Violin Events LLP</h2>
          <p>Dear ${inquiry.user.fullName},</p>
          <p>Thank you for reaching out to us. We have received your inquiry and our team will get back to you within 24 hours.</p>
          <hr>
          <p><strong>Here is a copy of your request:</strong></p>
          ${dynamicContent}
          <hr>
          <p>If you have any urgent questions, feel free to call us at <strong>+91 98765 43210</strong></p>
          <p>Warm regards,<br><strong>Team Violin Events</strong></p>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContactController;

