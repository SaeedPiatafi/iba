import { MongoClient, Db, Collection } from 'mongodb';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Teacher } from '@/types/teacher';

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'iba-database';
const MONGODB_COLLECTION = process.env.MONGODB_TEACHER_COLLECTION || 'Teachers';

// Local JSON storage
const LOCAL_DATA_PATH = join(process.cwd(), 'app', 'data', 'teachers.json');

// MongoDB connection
let mongoClient: MongoClient | null = null;
let isMongoConnected = false;

// Initialize MongoDB connection
async function initMongoDB() {
  if (!MONGODB_URI || isMongoConnected) return null;
  
  try {
    console.log('🔗 Attempting MongoDB connection...');
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // Reduced timeout
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    
    await client.connect();
    
    // Test connection
    await client.db(MONGODB_DB_NAME).command({ ping: 1 });
    
    mongoClient = client;
    isMongoConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    return client;
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, using local storage:', error.message);
    isMongoConnected = false;
    return null;
  }
}

// Get MongoDB collection (returns null if not available)
async function getMongoCollection(): Promise<Collection | null> {
  try {
    const client = await initMongoDB();
    if (!client) return null;
    
    const db = client.db(MONGODB_DB_NAME);
    return db.collection(MONGODB_COLLECTION);
  } catch (error) {
    console.warn('⚠️ Failed to get MongoDB collection:', error.message);
    return null;
  }
}

// Local JSON storage functions
function readLocalTeachers(): Teacher[] {
  try {
    if (!existsSync(LOCAL_DATA_PATH)) {
      return [];
    }
    const fileContents = readFileSync(LOCAL_DATA_PATH, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading local teachers:', error);
    return [];
  }
}

function writeLocalTeachers(teachers: Teacher[]): void {
  try {
    writeFileSync(LOCAL_DATA_PATH, JSON.stringify(teachers, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing local teachers:', error);
    throw error;
  }
}

// Sync local data to MongoDB when available
async function syncToMongoDB() {
  try {
    const collection = await getMongoCollection();
    if (!collection) return false;
    
    const localTeachers = readLocalTeachers();
    if (localTeachers.length === 0) return true;
    
    // Clear existing data in MongoDB
    await collection.deleteMany({});
    
    // Insert local data
    const teachersWithTimestamps = localTeachers.map(teacher => ({
      ...teacher,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    await collection.insertMany(teachersWithTimestamps);
    console.log(`✅ Synced ${teachersWithTimestamps.length} teachers to MongoDB`);
    return true;
  } catch (error) {
    console.warn('⚠️ Failed to sync to MongoDB:', error.message);
    return false;
  }
}

// Main storage class
export class TeacherStorage {
  private useMongoDB = false;
  
  constructor() {
    // Test MongoDB connection on initialization
    this.checkMongoDB();
  }
  
  private async checkMongoDB() {
    const collection = await getMongoCollection();
    this.useMongoDB = !!collection;
    console.log(`📊 Storage mode: ${this.useMongoDB ? 'MongoDB' : 'Local JSON'}`);
  }
  
  // Get all teachers
  async getAllTeachers(): Promise<Teacher[]> {
    if (this.useMongoDB) {
      try {
        const collection = await getMongoCollection();
        if (collection) {
          const teachers = await collection.find().sort({ id: 1 }).toArray();
          return teachers as Teacher[];
        }
      } catch (error) {
        console.warn('⚠️ MongoDB read failed, falling back to local:', error.message);
        this.useMongoDB = false;
      }
    }
    
    // Fallback to local
    return readLocalTeachers();
  }
  
  // Get teacher by ID
  async getTeacherById(id: number | string): Promise<Teacher | null> {
    if (this.useMongoDB) {
      try {
        const collection = await getMongoCollection();
        if (collection) {
          const numericId = typeof id === 'string' ? Number(id) : id;
          let teacher = await collection.findOne({ id: numericId });
          
          if (!teacher && typeof id === 'string') {
            teacher = await collection.findOne({ _id: id });
          }
          
          return teacher as Teacher | null;
        }
      } catch (error) {
        console.warn('⚠️ MongoDB get failed:', error.message);
      }
    }
    
    // Fallback to local
    const teachers = readLocalTeachers();
    const numericId = typeof id === 'string' ? Number(id) : id;
    return teachers.find(t => t.id === numericId) || null;
  }
  
  // Add teacher
  async addTeacher(teacherData: Omit<Teacher, 'id'>): Promise<Teacher> {
    const localTeachers = readLocalTeachers();
    
    // Generate new ID
    const newId = localTeachers.length > 0 
      ? Math.max(...localTeachers.map(t => t.id)) + 1 
      : 1;
    
    const newTeacher: Teacher = {
      id: newId,
      ...teacherData,
    };
    
    // Save locally first (always works)
    localTeachers.push(newTeacher);
    writeLocalTeachers(localTeachers);
    
    // Try to save to MongoDB if available
    if (this.useMongoDB) {
      try {
        const collection = await getMongoCollection();
        if (collection) {
          await collection.insertOne({
            ...newTeacher,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log('✅ Teacher saved to MongoDB');
        }
      } catch (error) {
        console.warn('⚠️ Failed to save to MongoDB:', error.message);
      }
    }
    
    return newTeacher;
  }
  
  // Update teacher
  async updateTeacher(id: number, teacherData: Partial<Teacher>): Promise<Teacher | null> {
    const localTeachers = readLocalTeachers();
    const index = localTeachers.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    // Update locally
    const updatedTeacher = {
      ...localTeachers[index],
      ...teacherData,
      id // Ensure ID doesn't change
    };
    
    localTeachers[index] = updatedTeacher;
    writeLocalTeachers(localTeachers);
    
    // Try to update MongoDB if available
    if (this.useMongoDB) {
      try {
        const collection = await getMongoCollection();
        if (collection) {
          await collection.updateOne(
            { id },
            { 
              $set: {
                ...teacherData,
                updatedAt: new Date()
              }
            }
          );
        }
      } catch (error) {
        console.warn('⚠️ Failed to update MongoDB:', error.message);
      }
    }
    
    return updatedTeacher;
  }
  
  // Delete teacher
  async deleteTeacher(id: number): Promise<boolean> {
    const localTeachers = readLocalTeachers();
    const index = localTeachers.findIndex(t => t.id === id);
    
    if (index === -1) return false;
    
    // Delete locally
    localTeachers.splice(index, 1);
    writeLocalTeachers(localTeachers);
    
    // Try to delete from MongoDB if available
    if (this.useMongoDB) {
      try {
        const collection = await getMongoCollection();
        if (collection) {
          await collection.deleteOne({ id });
        }
      } catch (error) {
        console.warn('⚠️ Failed to delete from MongoDB:', error.message);
      }
    }
    
    return true;
  }
  
  // Sync data (manual trigger)
  async syncData(): Promise<boolean> {
    return await syncToMongoDB();
  }
  
  // Get storage status
  getStorageStatus() {
    return {
      mode: this.useMongoDB ? 'mongodb' : 'local',
      mongoAvailable: this.useMongoDB,
      localCount: readLocalTeachers().length
    };
  }
}

// Singleton instance
export const teacherStorage = new TeacherStorage();