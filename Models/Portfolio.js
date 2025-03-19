import mongoose from "mongoose";

// 🌐 Portfolio Schema
const portfolioSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },

  // 🔑 Portfolio Access
  subdomain: { type: String, unique: true },  // e.g., random123.myportfoliosite.in
  customDomain: { type: String },  // e.g., shashank.dev
  isPremium: { type: Boolean, default: false },

  // 🎉 Portfolio Details
  title: { type: String },
  bio: { type: String },
  tagline: { type: String },
  location: { type: String },

  skills: [
    {
      name: String,
      proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
    }
  ],

  education: [
    {
      institution: String,
      degree: String,
      startDate: String,
      endDate: String,
      description: String,
    }
  ],

  experience: [
    {
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      description: String,
    }
  ],

  projects: [
    {
      title: String,
      description: String,
      techStack: [String],
      link: String,
      image: String,
    }
  ],

  achievements: [
    {
      title: String,
      organization: String,
      date: String,
      description: String,
      certificateLink: String,
    }
  ],

  testimonials: [
    {
      name: String,
      role: String,
      feedback: String,
    }
  ],
  certifications: [
    {
      title: { type: String, required: true },
      issuingOrganization: { type: String, required: true },
      issueDate: { type: Date, required: true },
      expiryDate: { type: Date },  // Optional
      certificateLink: { type: String },  // Optional
      description: { type: String },  // Optional
    }
  ],
  blogs: [
    {
      title: String,
      content: String,
      publishedDate: { type: Date, default: Date.now },
      link: String,
    }
  ],

  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String,
    instagram: String,
    youtube: String,
  },
  customSections: [
    {
      title: { type: String, required: true },  // Section title
      description: { type: String },  // Optional description
      items: [
        {
          label: { type: String, required: true },  // Item label
          value: { type: String },  // Item value
          link: { type: String },  // Optional link
          image: { type: String },  // Optional image URL
        }
      ]
    }
  ], 

  // 📊 Portfolio Analytics
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  backgroundColor: { type: String },
  backgroundImage: { type: String },
  layout: { type: String, enum: ['classic', 'modern', 'minimal'] },
  colorScheme: { type: String },

},{timestamps:true});

// Pre-save hook to auto-update isPremium based on subscription plan
portfolioSchema.pre('save', async function (next) {
    try {
      const customer = await mongoose.model('Customer').findById(this.customerId);
      
      if (customer) {
        // Check if the subscription is active
        const isActive = customer.subscriptionEndDate && new Date() <= customer.subscriptionEndDate;
        this.isPremium = isActive;
      } else {
        this.isPremium = false;
      }
      next();
    } catch (error) {
      console.error("Error fetching customer:", error);
      next(error);
    }
  });
  

// Create and export the model
const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
