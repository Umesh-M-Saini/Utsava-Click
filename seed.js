const mongoose = require('mongoose');
require('dotenv').config();
const Feedback = require('./models/Feedback');
const connectDB = require('./db/connection');

const seedFeedbacks = async () => {
    try {
        await connectDB();
        
        // Optional: Clear existing feedbacks if you want a clean start
        // await Feedback.deleteMany();

        const fakeFeedbacks = [
            {
                name: "Arjun Mehta",
                packageName: "Wedding Package",
                experience: "Utsava Click captured our wedding beautifully. The candid shots are our absolute favorite. Highly professional team!",
                rating: 5
            },
            {
                name: "Priya Sharma",
                packageName: "Pre-Wedding Package",
                experience: "The pre-wedding shoot was so much fun! They made us feel comfortable and the photos look like a dream.",
                rating: 5
            },
            {
                name: "Vikram Rathore",
                packageName: "Custom Package",
                experience: "Excellent service and quality. The album design is premium and the cinematic video is top-notch.",
                rating: 4
            },
            {
                name: "Ananya Iyer",
                packageName: "Wedding Package",
                experience: "Thank you for making our special day even more memorable. Every emotion was captured perfectly.",
                rating: 5
            },
            {
                name: "Siddharth Malhotra",
                packageName: "Event Package",
                experience: "Great work with the corporate event photography. Very punctual and the turnaround time was quick.",
                rating: 4
            },
            {
                name: "Sneha Kapoor",
                packageName: "Maternity Shoot",
                experience: "The maternity shoot was handled with so much care and patience. The results are heartwarming.",
                rating: 5
            },
            {
                name: "Rohan Gupta",
                packageName: "Pre-Wedding Package",
                experience: "Amazing creativity! The drone shots added such a unique perspective to our pre-wedding video.",
                rating: 5
            },
            {
                name: "Meera Reddy",
                packageName: "Wedding Package",
                experience: "Highly recommend Utsava Click for traditional weddings. They understand the rituals and capture them beautifully.",
                rating: 5
            },
            {
                name: "Aditya Verma",
                packageName: "Engagement Package",
                experience: "The team is very talented and hardworking. They didn't miss a single important moment of our engagement.",
                rating: 4
            },
            {
                name: "Neha Singh",
                packageName: "Birthday Party",
                experience: "Captured my daughter's first birthday party so well. The kids' expressions are priceless!",
                rating: 5
            },
            {
                name: "Ishaan Khattar",
                packageName: "Cinematic Video",
                experience: "The cinematic teaser was just WOW! All our friends and family were impressed with the quality.",
                rating: 5
            },
            {
                name: "Kavita Deshmukh",
                packageName: "Custom Package",
                experience: "Very patient and helpful with posing. The editing style is so natural and elegant.",
                rating: 5
            },
            {
                name: "Rajesh Khanna",
                packageName: "Traditional Photography",
                experience: "Expertly captured the candid moments without being intrusive. Truly artistic work.",
                rating: 4
            },
            {
                name: "Shweta Tiwari",
                packageName: "Wedding Package",
                experience: "Beautifully documented our rituals. The album quality is premium and feels very special.",
                rating: 5
            },
            {
                name: "Manish Pandey",
                packageName: "Pre-Wedding Package",
                experience: "Loved the locations suggested and the overall vibe of the shoot. Great experience!",
                rating: 5
            }
        ];

        await Feedback.insertMany(fakeFeedbacks);
        console.log("✅ 15 Indian feedbacks seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedFeedbacks();
