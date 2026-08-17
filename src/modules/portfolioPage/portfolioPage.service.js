const PortfolioPage = require("./portfolioPage.model");

class PortfolioPageService {
  // ✅ Get the portfolio page - ALWAYS returns a document (creates if none exists)
  static async getPage() {
    let page = await PortfolioPage.findOne();
    if (!page) {
      // Create default page if none exists
      page = await PortfolioPage.create({
        isActive: true,
        heroBanner: null,
        footerBanner: null,
        centerImageMain: null,
        centerImage1: null,
        centerImage2: null,
        centerImage3: null,
        images: [],
      });
    }
    return page;
  }

  // ✅ Update or Create portfolio page
  static async updatePage(data) {
    // Find existing page or create new one
    let page = await PortfolioPage.findOne();
    
    if (!page) {
      // Create new page with provided data
      page = new PortfolioPage(data);
    } else {
      // Update existing page with new data
      // Only update fields that are provided
      const updateableFields = [
        'heroBanner',
        'footerBanner',
        'centerImageMain',
        'centerImage1',
        'centerImage2',
        'centerImage3',
        'images',
        'isActive'
      ];
      
      updateableFields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null) {
          page[field] = data[field];
        }
      });
    }
    
    await page.save();
    return page;
  }

  // ✅ Get images only - ALWAYS returns data (creates if none exists)
  static async getImages() {
    // Ensure page exists
    const page = await this.getPage();
    
    return {
      heroBanner: page.heroBanner || null,
      footerBanner: page.footerBanner || null,
      centerImageMain: page.centerImageMain || null,
      centerImage1: page.centerImage1 || null,
      centerImage2: page.centerImage2 || null,
      centerImage3: page.centerImage3 || null,
      images: page.images || [],
    };
  }

  // ✅ Ensure page exists (called at app startup)
  static async ensurePageExists() {
    const page = await PortfolioPage.findOne();
    if (!page) {
      console.log("📄 Creating default portfolio page...");
      await PortfolioPage.create({
        isActive: true,
        heroBanner: null,
        footerBanner: null,
        centerImageMain: null,
        centerImage1: null,
        centerImage2: null,
        centerImage3: null,
        images: [],
      });
      console.log("✅ Default portfolio page created");
    } else {
      console.log("✅ Portfolio page already exists");
    }
    return page;
  }
}

module.exports = PortfolioPageService;