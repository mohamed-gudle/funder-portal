const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivitySchema = new Schema({
  // 1. Who did this?
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 2. What kind of activity?
  type: {
    type: String,
    enum: ['Call Log', 'Email', 'Meeting Note', 'Internal Comment', 'Status Change'],
    required: true
  },

  // 3. The content
  content: {
    type: String,
    required: true,
    trim: true
  },

  // 4. AI Sentiment Placeholder
  sentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
    default: 'Neutral'
  },

  // --- POLYMORPHIC ASSOCIATION (The "Magic" Part) ---
  
  // The ID of the document this activity belongs to (Call OR Engagement)
  parent: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'parentModel' // Tells Mongoose: "Look at the 'parentModel' field to know which collection to search"
  },

  // The specific collection name
  parentModel: {
    type: String,
    required: true,
    enum: ['CompetitiveCall', 'BilateralEngagement']
  }

}, { timestamps: true });

// Indexing: Essential for performance so the dashboard loads fast
// "Get me all activities for this specific Call, sorted by date"
ActivitySchema.index({ parent: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. Define Stages Constant (Single Source of Truth)
const CALL_STAGES = [
  'In Review', 
  'Go/No-Go', 
  'Proposal Writing', 
  'Internal Review', 
  'Submission Stage', 
  'Submitted', 
  'Accepted', 
  'Rejected'
];

// 2. Sub-Schema for Permissions
const StagePermissionSchema = new Schema({
  stage: { 
    type: String, 
    required: true, 
    enum: CALL_STAGES 
  },
  // The "Person(s)" allowed to act on this stage
  assignees: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }] 
}, { _id: false }); // No need for separate IDs for these sub-docs

// 3. Main Competitive Call Schema
const CompetitiveCallSchema = new Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  
  status: {
    type: String,
    enum: CALL_STAGES,
    default: 'In Review'
  },

  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },

  fundingType: {
    type: String,
    enum: ['Core Funding', 'Programmatic Funding'],
    required: true
  },
  
  relatedProgram: {
    type: Schema.Types.ObjectId,
    ref: 'Program', 
    required: function() { return this.fundingType === 'Programmatic Funding'; }
  },

  deadline: {
    type: Date
  },

  // --- DYNAMIC STAGE PERMISSIONS ---
  // If a stage is missing from this array, it defaults to "Open to Everyone"
  stagePermissions: {
    type: [StagePermissionSchema],
    default: [] 
  }

}, { timestamps: true });

// 4. Helper Method (Optional but helpful for dev)
// Usage: const canEdit = call.canUserEdit(user, 'Submission Stage');
CompetitiveCallSchema.methods.canUserEdit = function(userId, currentStage) {
  // Find the permission setting for the specific stage
  const permission = this.stagePermissions.find(p => p.stage === currentStage);

  // If no rule exists, OR if the assignee list is empty, it's OPEN.
  if (!permission || permission.assignees.length === 0) {
    return true; 
  }

  // Otherwise, check if the user is in the list
  return permission.assignees.some(id => id.equals(userId));
};

module.exports = mongoose.model('CompetitiveCall', CompetitiveCallSchema);



const mongoose = require('mongoose');
const { Schema } = mongoose;

const BilateralEngagementSchema = new Schema({
  // 1. The External Stakeholder (No separate Account table)
  organizationName: {
    type: String,
    required: true,
    trim: true,
    index: true // indexed for fast search in the search bar
  },

  contactPerson: {
    type: String, // e.g., "Bill Gates"
    trim: true
  },

  contactRole: {
    type: String, // e.g., "Senior Program Officer"
    trim: true
  },

  email: {
    type: String,
    lowercase: true,
    trim: true
  },

  // 2. The Internal Owner
  // The primary person on your team responsible for this relationship
  internalOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 3. The CRM Pipeline (Fluid Stages)
  status: {
    type: String,
    enum: [
      'Cold Email',       // Just reached out
      'First Engagement', // They replied / Meeting set
      'Proposal Stage',   // We sent a concept note
      'Contracting',      // Due diligence
      'Partner',          // Active Partnership
      'Funder',           // Active Donor
      'No Relationship'   // Dead lead
    ],
    default: 'Cold Email'
  },

  // 4. Intelligence Data
  // This powers the "Thermometer" visual (0% to 100%)
  likelihoodToFund: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },

  // Financial Potential
  estimatedValue: {
    type: Number, // e.g., 50000
    default: 0
  },

  currency: {
    type: String,
    enum: ['USD', 'KES', 'EUR', 'GBP'],
    default: 'USD'
  },
  
  // 5. Categorization (for filtering)
  tags: [{
    type: String // e.g. ["Climate", "Tech", "Nairobi"]
  }]

}, { timestamps: true });

// --- VIRTUALS (Optional helper) ---
// This allows you to quickly see if this engagement is "Hot" or "Cold" in code
BilateralEngagementSchema.virtual('temperatureLabel').get(function() {
  if (this.likelihoodToFund >= 70) return 'Hot';
  if (this.likelihoodToFund >= 30) return 'Warm';
  return 'Cold';
});

module.exports = mongoose.model('BilateralEngagement', BilateralEngagementSchema);


const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
  // Link back to the Engagement (The Organization)
  engagement: {
    type: Schema.Types.ObjectId,
    ref: 'BilateralEngagement',
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  role: {
    type: String, // e.g., "Program Officer", "Director"
    trim: true
  },

  email: {
    type: String,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    trim: true
  },

  // meaningful flag: Who do we call first?
  isPrimaryPointOfContact: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);


const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. Define Stages (Single Source of Truth)
const ENGAGEMENT_STAGES = [
  'Cold Email',
  'First Engagement', 
  'Proposal Stage', 
  'Contracting', 
  'Partner', 
  'Funder', 
  'No Relationship'
];

// 2. Sub-Schema for Permissions (Identical to Competitive Calls)
const StagePermissionSchema = new Schema({
  stage: { 
    type: String, 
    required: true, 
    enum: ENGAGEMENT_STAGES 
  },
  // The "Worker(s)" allowed to act on this stage
  assignees: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }] 
}, { _id: false });

// 3. Main Engagement Schema
const BilateralEngagementSchema = new Schema({
  organizationName: {
    type: String,
    required: true,
    index: true
  },

  // CRM Pipeline Status
  status: {
    type: String,
    enum: ENGAGEMENT_STAGES,
    default: 'Cold Email'
  },

  // "Temperature" Logic
  likelihoodToFund: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },

  estimatedValue: {
    type: Number, 
    default: 0
  },

  // --- DYNAMIC STAGE PERMISSIONS ---
  // If empty, open to everyone. If populated, restricted to specific users.
  stagePermissions: {
    type: [StagePermissionSchema],
    default: [] 
  }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// --- VIRTUAL POPULATE ---
// This allows you to get all contacts without storing an array of IDs here.
// usage: await BilateralEngagement.find().populate('contacts');
BilateralEngagementSchema.virtual('contacts', {
  ref: 'Contact',          // The model to use
  localField: '_id',       // Find people where `localField`
  foreignField: 'engagement' // is equal to `foreignField`
});

module.exports = mongoose.model('BilateralEngagement', BilateralEngagementSchema);


