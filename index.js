import {Queue} from 'bullmq';
import Redis from 'ioredis';
import {Worker} from 'bullmq';


const redisConnection = new Redis({
    host: 'redis-17837.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 17837,
    password: 'ZsedDLfGwmSA0hNIEmL0E6s41Qht4wYE',
    maxRetriesPerRequest: null
})

const commentNotificationQueue = new Queue('comment-email-notification', {connection: redisConnection});

async function addJobs() {
    const comments = [
        {
            "text": "I really enjoyed your article on machine learning! The explanation of different algorithms was very clear and concise. Keep up the good work!",
            "commenter_name": "John Smith",
            "commenter_email": "john.smith@example.com", "author_name": "Jane Doe",
            "author_email": "jane.doe@example.com"
        },
        {
            "text": "This phone is amazing! The battery life is fantastic, and the camera takes stunning photos. I would highly recommend it to anyone looking for a new phone.",
            "commenter_name": "Sarah Lee",
            "commenter_email": "sarah.lee@example.com", "author_name": "Stephan Josh"
        },
        {
            "text": "Thanks for your insights on the future of AI. I agree that ethical considerations are crucial as this technology advances.",
            "commenter_name": "David Kim",
            "commenter_email": "david.kim@example.com", "author_name": "Michael Brown",
            "author_email": "michael.brown@example.com"
        }
    ]
    for (const comment of comments) {
        await commentNotificationQueue.add(comment?.commenter_name, comment);
    }
}

await addJobs();

const commentNotificationWorker = new Worker('comment-email-notification',
    async job => {
        const {commenter_name, author_name} = job?.data;
        // process comment and send email to author's email about the new comment that he/she receives

        console.log(`${commenter_name} commented on ${author_name} article`)
    }, {connection: redisConnection});

