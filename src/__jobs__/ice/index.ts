import { CronJob } from "cron"


const logger = console;

// https://crontab.guru/#0_9_*_*_0,3 不准确了，查看github
const job = new CronJob(
    '0 */5 * * * *',  // At 5 minutes
    function () {
        try {
            logger.log("ICE CronJob onTick:", new Date().toLocaleString());


            logger.log("ICE CronJob nextDate:", job.nextDate().toLocaleString())
        } catch (err) {
            logger.error("ICE CronJob onTick error:", err);
        }
    },
    null,
    true,
    'Asia/Shanghai',
    {},
    true
);
logger.log("ICE CronJob nextDate:", job.nextDate().toLocaleString())
job.start();
