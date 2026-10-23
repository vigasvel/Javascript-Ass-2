const { Schema, model } = require('mongoose');

const PatientSchema = new Schema(
  {
    patientId: { type: String, unique: true }, // e.g. MS-1001 (generated)
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 3 },
    age: { type: Number, required: true, min: [0, 'Invalid age'], max: [120, 'Invalid age'] },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, required: true, match: [/^[6-9]\d{9}$/, 'Phone must be a 10-digit mobile number'] },
    email: { type: String, lowercase: true, trim: true, match: [/^$|^\S+@\S+\.\S+$/, 'Invalid email'] },
    bloodGroup: { type: String, enum: ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], default: '' },
    address: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

// Generate a readable patient id before the first save
PatientSchema.pre('save', async function (next) {
  if (this.patientId) return next();
  const last = await this.constructor.findOne({}, 'patientId').sort({ createdAt: -1 });
  const n = last?.patientId ? parseInt(last.patientId.split('-')[1], 10) + 1 : 1001;
  this.patientId = `MS-${n}`;
  next();
});

module.exports = model('Patient', PatientSchema);
