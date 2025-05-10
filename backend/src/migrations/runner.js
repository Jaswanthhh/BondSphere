const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/database');

class MigrationRunner {
  constructor() {
    this.migrations = [];
    this.migrationStatus = new Map();
  }

  async connect() {
    try {
      await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async loadMigrations() {
    try {
      const migrationFiles = await fs.readdir(__dirname);
      const migrationModules = migrationFiles
        .filter(file => file.endsWith('.js') && file !== 'runner.js')
        .sort();

      for (const file of migrationModules) {
        const migration = require(path.join(__dirname, file));
        this.migrations.push({
          name: file,
          module: migration
        });
      }

      console.log(`📦 Loaded ${this.migrations.length} migrations`);
    } catch (error) {
      console.error('❌ Error loading migrations:', error);
      throw error;
    }
  }

  async createMigrationCollection() {
    try {
      const collection = mongoose.connection.collection('migrations');
      await collection.createIndex({ name: 1 }, { unique: true });
      return collection;
    } catch (error) {
      console.error('❌ Error creating migrations collection:', error);
      throw error;
    }
  }

  async getExecutedMigrations() {
    try {
      const collection = await this.createMigrationCollection();
      const executed = await collection.find({}).toArray();
      return new Set(executed.map(m => m.name));
    } catch (error) {
      console.error('❌ Error getting executed migrations:', error);
      throw error;
    }
  }

  async markMigrationAsExecuted(name, direction) {
    try {
      const collection = await this.createMigrationCollection();
      if (direction === 'up') {
        await collection.insertOne({
          name,
          executedAt: new Date()
        });
      } else {
        await collection.deleteOne({ name });
      }
    } catch (error) {
      console.error(`❌ Error marking migration ${name} as ${direction}:`, error);
      throw error;
    }
  }

  async runMigration(migration, direction) {
    try {
      console.log(`🔄 Running ${direction} migration: ${migration.name}`);
      await migration.module[direction]();
      await this.markMigrationAsExecuted(migration.name, direction);
      console.log(`✅ Completed ${direction} migration: ${migration.name}`);
    } catch (error) {
      console.error(`❌ Error running ${direction} migration ${migration.name}:`, error);
      throw error;
    }
  }

  async migrate(direction = 'up') {
    try {
      await this.connect();
      await this.loadMigrations();
      const executedMigrations = await this.getExecutedMigrations();

      const migrationsToRun = direction === 'up'
        ? this.migrations.filter(m => !executedMigrations.has(m.name))
        : [...this.migrations].reverse().filter(m => executedMigrations.has(m.name));

      for (const migration of migrationsToRun) {
        await this.runMigration(migration, direction);
      }

      console.log(`✨ All migrations completed successfully`);
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
    }
  }
}

// Command line interface
const runner = new MigrationRunner();
const direction = process.argv[2] === 'down' ? 'down' : 'up';
runner.migrate(direction); 