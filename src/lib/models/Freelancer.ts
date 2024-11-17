import mongoose from 'mongoose'

const freelancerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Naam is verplicht'],
    trim: true,
    minlength: [2, 'Naam moet minimaal 2 karakters lang zijn']
  },
  email: {
    type: String,
    required: [true, 'Email is verplicht'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Voer een geldig emailadres in']
  },
  skills: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        const validSkills = [
          'Frontend',
          'Backend',
          'UI/UX',
          'Mobile',
          'DevOps'
        ]
        return v.length > 0 && v.every(skill => validSkills.includes(skill))
      },
      message: 'Selecteer minimaal één geldige skill'
    }
  },
  experience: {
    type: String,
    required: [true, 'Ervaring is verplicht'],
    enum: {
      values: ['0-2 jaar', '2-5 jaar', '5-10 jaar', '10+ jaar'],
      message: 'Selecteer een geldige ervaring optie'
    }
  },
  availability: {
    type: String,
    required: [true, 'Beschikbaarheid is verplicht'],
    enum: {
      values: ['0-8 uur', '8-16 uur', '16-24 uur', '24-32 uur', '32-40 uur'],
      message: 'Selecteer een geldige beschikbaarheid optie'
    }
  },
  rate: {
    type: String,
    required: [true, 'Uurtarief is verplicht'],
    enum: {
      values: ['€30-€50 per uur', '€50-€75 per uur', '€75-€100 per uur', '> €100 per uur'],
      message: 'Selecteer een geldig uurtarief'
    }
  },
  portfolio: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v)
      },
      message: 'Portfolio URL moet beginnen met http:// of https://'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['beschikbaar', 'bezet', 'inactief'],
      message: 'Ongeldige status'
    },
    default: 'beschikbaar'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Voeg indexes toe
freelancerSchema.index({ status: 1, createdAt: -1 })
freelancerSchema.index({ email: 1 }, { unique: true })
freelancerSchema.index({ skills: 1 })

const Freelancer = mongoose.models.Freelancer || mongoose.model('Freelancer', freelancerSchema)

export default Freelancer 