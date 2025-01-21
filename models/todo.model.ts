import mongoose, { Schema, Document, Model } from "mongoose";

const TodoSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true, 
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        dueDate: {
            type: Date
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        reminder: {
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const TodoModel: any = mongoose.model("todo", TodoSchema);

export default TodoModel;
