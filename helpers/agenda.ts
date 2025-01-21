const { Agenda } = require("@hokify/agenda");
import { environment } from "../utils/environment";
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
import TodoModel from "../models/todo.model";
import sendEmailReminder from "../helpers/email";

const DB_URI: string = environment.database.uri;

const agenda = new Agenda({ db: { address: DB_URI, collection: "cronjobs" } });

agenda.define("send email reminder", async (job: any) => {
  const jobName: string = job.attrs.name || "Unnamed Job";
  const jobData: Record<string, any> = job.attrs.data || {};

  console.log(`Running job: ${jobName}`);
  console.log(`Job data: ${JSON.stringify(jobData)}`);

  try {
    const currentTime = dayjs().toDate();
    const next3min = dayjs().add(3, "minute").toDate();

    console.log(currentTime, next3min);
    
    const todos = await TodoModel.find({
      $and: [
        { reminder: { $gte: currentTime } },
        { reminder: { $lt: next3min } },
      ],
    }).populate('userId').lean();

    console.log(todos, "todos");
    
    for (let i = 0; i < todos?.length; i++) {
        sendEmailReminder(todos[i]?.userId?.email, todos[i]?.title, todos[i]?.reminder);
    }
  } catch (error) {
    console.log(error);
  }
});

export const start = async (): Promise<any> => {
  try {
    await agenda.start();

    // Schedule a recurring job every 3 minutes
    await agenda.every("3 minutes", "send email reminder", null, {
      timezone: "Asia/Kolkata",
    });

    return true;
  } catch (error) {
    console.error("Error: in Agenda starting", error);
  }
};
