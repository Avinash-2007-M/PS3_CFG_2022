const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Course = require("./models/Course");
const Session = require("./models/Session");
const Resource = require("./models/Resource");

dotenv.config();

const sessionDefinitions = [
  ["Foundations of Water Quality", "Understand the shared language and purpose of water quality management.", "Introduce the WQM approach, the role of Water Quality Champions, and the connection between water, health, and community action.", "90 minutes"],
  ["Water, Health, and Communities", "Explore how water quality affects people and local communities.", "Map common exposure pathways and community concerns while identifying the people and places most affected by water-quality challenges.", "90 minutes"],
  ["Understanding Water Quality Indicators", "Learn the key physical, chemical, and biological indicators.", "Build a practical understanding of indicators, what they tell us, and how to interpret observations responsibly.", "120 minutes"],
  ["Sampling and Field Observation", "Practice a consistent approach to field observation and sampling.", "Plan a field visit, document observations, and follow clear steps for recording reliable evidence.", "120 minutes"],
  ["Reading and Using Water Data", "Turn observations and test results into useful insight.", "Review simple data patterns, identify uncertainty, and communicate findings without overstating conclusions.", "120 minutes"],
  ["Identifying Local Water Risks", "Connect evidence to local risks and possible causes.", "Use a community lens to identify risks, investigate contributing factors, and prioritize questions for follow-up.", "90 minutes"],
  ["Community Engagement for WQM", "Bring people into practical water-quality action.", "Plan an inclusive conversation, listen to lived experience, and build shared ownership of next steps.", "90 minutes"],
  ["Planning Water Quality Action", "Create a realistic action plan for a local water challenge.", "Set an achievable objective, identify partners, define activities, and choose indicators for tracking progress.", "120 minutes"],
  ["Champion Practice and Next Steps", "Reflect on learning and plan continued champion practice.", "Bring the course together through reflection, peer learning, and a personal next-step commitment.", "90 minutes"]
];

const seed = async () => {
  await connectDB();
  const course = await Course.findOneAndUpdate(
    { title: "Water Quality Management" },
    {
      title: "Water Quality Management",
      description: "A nine-session learning journey for Water Quality Champions to understand, observe, and act on local water-quality challenges.",
      totalSessions: 9
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  await Session.deleteMany({ courseId: course._id });
  await Session.insertMany(sessionDefinitions.map(([title, description, content, duration], index) => ({
    courseId: course._id,
    sessionNumber: index + 1,
    title,
    description,
    content,
    duration,
    requiredForNextSession: true
  })));

  const resources = [
    { title: "WQM Orientation Guide", description: "A starting guide for the Water Quality Management course.", type: "guide", url: "https://inrem.in", requiredSession: 1, isActive: true },
    { title: "Water Quality Field Notes", description: "A reference for documenting observations during field work.", type: "field-guide", url: "https://inrem.in", requiredSession: 4, isActive: true },
    { title: "Community Action Planning Guide", description: "A guide for shaping evidence-informed local action.", type: "guide", url: "https://inrem.in", requiredSession: 7, isActive: true }
  ];
  for (const resource of resources) {
    await Resource.findOneAndUpdate({ title: resource.title }, resource, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
  }

  console.log(`Seeded WQM course with ${sessionDefinitions.length} sessions in ${mongoose.connection.db.databaseName}.`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(`Seed failed: ${error.message}`);
  await mongoose.disconnect();
  process.exit(1);
});
