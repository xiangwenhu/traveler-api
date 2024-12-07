import '../../utils/env';
import * as cron from "cron"
import job from "./job";
const logger = console;

// https://crontab.guru/#0_9_*_*_0,3 不准确了，查看github
const cronJob = new cron.CronJob(
    '0 */5 * * * *',  // At 5 minutes
    function () {
        try {
            logger.log("ICE CronJob onTick:", new Date().toLocaleString());
            job();
            logger.log("ICE CronJob nextDate:", cronJob.nextDate().toJSDate().toLocaleString())
        } catch (err) {
            logger.error("ICE CronJob onTick error:", err);
        }
    },
    null,
    true,
    'Asia/Shanghai',
    {},
    false
);
logger.log("ICE CronJob nextDate:", cronJob.nextDate().toJSDate().toLocaleString())
cronJob.start();
