// src/modules/contact/contact.service.js
const Contact = require("./contact.model");

class ContactService {
  // Get all contact inquiries with filters
  static async getAll(query = {}) {
    const { status, limit = 50, page = 1 } = query;
    const filter = {};

    // ✅ Only add status to filter if it exists and is not 'undefined' or empty
    if (status && status !== 'undefined' && status !== '') {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Contact.find(filter)
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 }),
      Contact.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get single contact inquiry by ID
  static async getById(id) {
    return await Contact.findById(id);
  }

  // Create a new contact inquiry
  static async create(data) {
    return await Contact.create(data);
  }

  // Update contact inquiry status
  static async update(id, data) {
    return await Contact.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  // Delete contact inquiry
  static async delete(id) {
    return await Contact.findByIdAndDelete(id);
  }

  // Get contact statistics
  static async getStats() {
    const total = await Contact.countDocuments();
    const pending = await Contact.countDocuments({ status: "pending" });
    const read = await Contact.countDocuments({ status: "read" });
    const replied = await Contact.countDocuments({ status: "replied" });

    return {
      total,
      pending,
      read,
      replied,
    };
  }
}

module.exports = ContactService;