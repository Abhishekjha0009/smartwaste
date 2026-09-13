import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Category from '../models/Category.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartwaste';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Complaint.deleteMany();
    await Category.deleteMany();
    console.log('[Seed] Cleared existing database records.');

    // 1. Create Default Users for all 4 Roles
    const citizen = await User.create({
      name: 'Aarav Sharma',
      email: 'citizen@smartwaste.org',
      password: 'password123',
      role: 'Citizen',
      phone: '+91 98765 43210',
      assignedZone: 'Connaught Place Sector 4',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      stats: { totalReported: 8, pointsEarned: 240 }
    });

    const worker1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'worker@smartwaste.org',
      password: 'password123',
      role: 'Worker',
      phone: '+91 98111 22233',
      assignedZone: 'Central Market Zone',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isAvailable: true,
      stats: { tasksCompleted: 24 }
    });

    const worker2 = await User.create({
      name: 'Sunita Devi',
      email: 'worker2@smartwaste.org',
      password: 'password123',
      role: 'Worker',
      phone: '+91 98222 33344',
      assignedZone: 'North Extension',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      isAvailable: true,
      stats: { tasksCompleted: 19 }
    });

    const authority = await User.create({
      name: 'Vikram Malhotra',
      email: 'authority@smartwaste.org',
      password: 'password123',
      role: 'Authority',
      phone: '+91 99000 88877',
      assignedZone: 'Municipal Head Command',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    });

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@smartwaste.org',
      password: 'password123',
      role: 'Admin',
      phone: '+91 99999 00000',
      assignedZone: 'System Root',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    });

    console.log('[Seed] Users created successfully for Citizen, Worker, Authority, Admin roles.');

    // 2. Create Categories
    const categories = await Category.insertMany([
      { name: 'Plastic', code: 'PLAST', description: 'PET bottles, bags, wrappers, plastic containers', colorHex: '#3B82F6', hazardLevel: 'Medium', disposalInstructions: 'Recycle at Plastic Granulation Hub' },
      { name: 'Organic', code: 'ORGBIO', description: 'Food scraps, garden waste, wet waste', colorHex: '#10B981', hazardLevel: 'Low', disposalInstructions: 'Send to Bio-Compost Facility' },
      { name: 'Hazardous', code: 'HAZMAT', description: 'Chemicals, medical items, paint, batteries', colorHex: '#EF4444', hazardLevel: 'Critical', disposalInstructions: 'HazMat Containment protocol' },
      { name: 'E-Waste', code: 'EWASTE', description: 'Electronic boards, cables, broken appliances', colorHex: '#8B5CF6', hazardLevel: 'High', disposalInstructions: 'E-waste metal extraction facility' },
      { name: 'Bulky', code: 'BULKY', description: 'Abandoned furniture, tires, large items', colorHex: '#F59E0B', hazardLevel: 'Medium', disposalInstructions: 'Heavy vehicle transport' },
      { name: 'Construction', code: 'C&D', description: 'Rubble, concrete, bricks, tiles', colorHex: '#64748B', hazardLevel: 'Low', disposalInstructions: 'C&D Aggregate recycling plant' }
    ]);

    // 3. Create Sample Complaints with realistic locations & images
    const sampleComplaints = [
      {
        citizenId: citizen._id,
        citizenName: citizen.name,
        title: 'Plastic Bottle Dumping near Bus Station',
        description: 'Large pile of single-use plastic bottles clogging the main drainage outlet.',
        imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800',
        beforeImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800',
        location: { latitude: 28.6139, longitude: 77.2090, address: 'Connaught Place Sector 4, Main Bus Stop', area: 'Central Market Zone' },
        category: 'Plastic',
        severity: 'High',
        aiClassification: {
          detectedCategory: 'Plastic',
          severity: 'High',
          confidence: 0.94,
          recyclable: true,
          recommendation: 'Priority recycling pickup required before rain.',
          tags: ['pet-bottles', 'drainage-hazard', 'recyclable']
        },
        status: 'Pending',
        timeline: [{ status: 'Pending', note: 'Report submitted by citizen', updatedBy: citizen.name }]
      },
      {
        citizenId: citizen._id,
        citizenName: citizen.name,
        title: 'Overflowing Food Waste behind Market Alley',
        description: 'Decomposing vegetable and fruit waste causing severe foul odor and insect infestation.',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
        beforeImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
        location: { latitude: 28.6250, longitude: 77.2180, address: 'Block C Alley, Central Market', area: 'Central Market Zone' },
        category: 'Organic',
        severity: 'Critical',
        aiClassification: {
          detectedCategory: 'Organic',
          severity: 'Critical',
          confidence: 0.96,
          recyclable: false,
          recommendation: 'Immediate bio-hazard sanitation dispatch required.',
          tags: ['food-waste', 'decomposition', 'pest-risk']
        },
        status: 'Assigned',
        assignedWorkerId: worker1._id,
        assignedWorkerName: worker1.name,
        assignedBy: authority._id,
        timeline: [
          { status: 'Pending', note: 'Report submitted by citizen', updatedBy: citizen.name },
          { status: 'Assigned', note: `Assigned to worker ${worker1.name}`, updatedBy: authority.name }
        ]
      },
      {
        citizenId: citizen._id,
        citizenName: citizen.name,
        title: 'Discarded Electronics & Wire Waste',
        description: 'Old computer monitors and copper wire insulation dumped on park perimeter.',
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
        beforeImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
        location: { latitude: 28.6320, longitude: 77.2210, address: 'Park Avenue Gate 2', area: 'North Extension' },
        category: 'E-Waste',
        severity: 'High',
        aiClassification: {
          detectedCategory: 'E-Waste',
          severity: 'High',
          confidence: 0.91,
          recyclable: true,
          recommendation: 'Dispatch E-Waste specialized handling unit.',
          tags: ['monitors', 'heavy-metals', 'e-waste']
        },
        status: 'In Progress',
        assignedWorkerId: worker2._id,
        assignedWorkerName: worker2.name,
        assignedBy: authority._id,
        timeline: [
          { status: 'Pending', note: 'Report submitted by citizen', updatedBy: citizen.name },
          { status: 'Assigned', note: `Assigned to ${worker2.name}`, updatedBy: authority.name },
          { status: 'In Progress', note: 'Worker arrived at site & commenced cleanup.', updatedBy: worker2.name }
        ]
      },
      {
        citizenId: citizen._id,
        citizenName: citizen.name,
        title: 'Cleaned Up Construction Debris Spill',
        description: 'Broken concrete blocks and ceramic tile waste from private renovation.',
        imageUrl: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&q=80&w=800',
        beforeImage: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&q=80&w=800',
        afterImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        location: { latitude: 28.6180, longitude: 77.2050, address: 'Ring Road Crossing', area: 'Central Market Zone' },
        category: 'Construction',
        severity: 'Medium',
        aiClassification: {
          detectedCategory: 'Construction',
          severity: 'Medium',
          confidence: 0.88,
          recyclable: false,
          recommendation: 'C&D waste haul truck dispatch.',
          tags: ['rubble', 'concrete', 'c&d']
        },
        status: 'Resolved',
        assignedWorkerId: worker1._id,
        assignedWorkerName: worker1.name,
        assignedBy: authority._id,
        resolutionNotes: 'Site thoroughly cleared using loader truck and area sanitized.',
        resolvedAt: new Date(),
        timeline: [
          { status: 'Pending', note: 'Report submitted by citizen', updatedBy: citizen.name },
          { status: 'Assigned', note: `Assigned to ${worker1.name}`, updatedBy: authority.name },
          { status: 'In Progress', note: 'Cleanup initiated with loader vehicle.', updatedBy: worker1.name },
          { status: 'Resolved', note: 'Site fully restored and verified clean.', updatedBy: worker1.name }
        ]
      }
    ];

    await Complaint.insertMany(sampleComplaints);
    console.log(`[Seed] ${sampleComplaints.length} sample complaints seeded with full AI metadata & timeline history.`);

    console.log('----------------------------------------------------');
    console.log('✅ SmartWaste Database Seeded Successfully!');
    console.log('🔑 Login Credentials for Testing:');
    console.log('   Citizen:   citizen@smartwaste.org   / password123');
    console.log('   Worker:    worker@smartwaste.org    / password123');
    console.log('   Authority: authority@smartwaste.org / password123');
    console.log('   Admin:     admin@smartwaste.org     / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
