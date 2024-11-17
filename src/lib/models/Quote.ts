import mongoose from 'mongoose'

const quoteSchema = new mongoose.Schema({
  websiteType: {
    type: String,
    required: [true, 'Website type is verplicht'],
    enum: {
      values: ['corporate', 'webshop', 'portfolio', 'landing'],
      message: 'Ongeldig website type'
    }
  },
  features: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        const validFeatures = ['Responsive design', 'CMS integratie', 'Contact formulieren', 'Analytics']
        return v.every(feature => validFeatures.includes(feature))
      },
      message: 'Ongeldige feature geselecteerd'
    }
  },
  budget: {
    type: String,
    required: [true, 'Budget is verplicht'],
    enum: {
      values: ['< €5000', '€5000 - €10000', '€10000 - €20000', '> €20000'],
      message: 'Ongeldig budget geselecteerd'
    }
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is verplicht'],
    enum: {
      values: ['< 1 maand', '1-2 maanden', '2-3 maanden', '> 3 maanden'],
      message: 'Ongeldige timeline geselecteerd'
    }
  },
  companyName: {
    type: String,
    required: [true, 'Bedrijfsnaam is verplicht'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Contactpersoon is verplicht'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is verplicht'],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Voer een geldig emailadres in']
  },
  phone: {
    type: String,
    required: [true, 'Telefoonnummer is verplicht'],
    trim: true
  },
  additionalInfo: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['nieuw', 'in_behandeling', 'afgerond', 'geannuleerd'],
    default: 'nieuw'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Voeg indexes toe voor betere zoekprestaties
quoteSchema.index({ status: 1, createdAt: -1 })
quoteSchema.index({ companyName: 1 })
quoteSchema.index({ email: 1 })

const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema)

export default Quote 