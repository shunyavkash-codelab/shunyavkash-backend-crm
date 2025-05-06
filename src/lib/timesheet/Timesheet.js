import mongoose from 'mongoose';

const timesheetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    hoursWorked: {
      type: Number,
      required: true
    },
    description: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    isFinalized: {
      type: Boolean,
      default: false
    }
  },
  {
    timeseries: true
  }
);

export default mongoose.model('Timesheet', timesheetSchema);
