import mongoose, { Document, Model, Schema } from 'mongoose';

export type ToolCategory = 'Writing' | 'Image' | 'Coding' | 'Productivity' | 'Research';

export interface ITool extends Document {
  name: string;
  description: string;
  category: ToolCategory;
  url: string;
  icon_url?: string;
  is_free: boolean;
  is_featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ToolSchema = new Schema<ITool>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category:    {
      type: String,
      enum: ['Writing', 'Image', 'Coding', 'Productivity', 'Research'],
      required: true,
    },
    url:         { type: String, required: true },
    icon_url:    { type: String },
    is_free:     { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ToolSchema.index({ name: 'text', description: 'text' });

const Tool: Model<ITool> =
  mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema);

export default Tool;
