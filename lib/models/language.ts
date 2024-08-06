import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  supports_formality: {
    type: Boolean,
    default: false,
  },
});

const Language =
  mongoose.models.Language || mongoose.model('Language', languageSchema);

export default Language;
