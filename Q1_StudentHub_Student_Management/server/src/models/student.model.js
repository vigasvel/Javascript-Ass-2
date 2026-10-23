const { Schema, model } = require('mongoose');

const StudentSchema = new Schema(
  {
    regNo: { type: String, required: true, unique: true, uppercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    department: { type: String, required: true },
    section: { type: String, enum: ['A', 'B', 'C', 'D'], default: 'A' },
    attendance: { type: Number, min: 0, max: 100, default: 100 }, // percentage
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
    hosteller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// virtual field used by the UI to highlight shortage of attendance
StudentSchema.virtual('eligible').get(function () {
  return this.attendance >= 75;
});
StudentSchema.set('toJSON', { virtuals: true });

module.exports = model('Student', StudentSchema);
