import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: 'Job' | 'Internship' | 'Full-time';
  batch_year?: number;
  salary?: string;
  apply_link: string;
  deadline?: Date;
  description: string;
  is_featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title:       { type: String, required: true, trim: true },
    company:     { type: String, required: true, trim: true },
    location:    { type: String, required: true, trim: true },
    type:        { type: String, enum: ['Job', 'Internship', 'Full-time'], required: true },
    batch_year:  { type: Number },
    salary:      { type: String },
    apply_link:  { type: String, required: true },
    deadline:    { type: Date },
    description: { type: String, required: true },
    is_featured: { type: Boolean, default: false },
    tags:        [{ type: String }],
  },
  { timestamps: true }
);

// Full-text search index for search functionality
JobSchema.index({ title: 'text', company: 'text', description: 'text', tags: 'text' });

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
