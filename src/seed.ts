import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get models
  const UserModel = app.get('UserModel');
  const DealerModel = app.get('DealerModel');

  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await UserModel.deleteMany({});
  await DealerModel.deleteMany({});
  console.log('✅ Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await UserModel.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: adminPassword,
    role: 'admin',
  });
  console.log('✅ Created admin user:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await UserModel.create({
    name: 'Regular User',
    email: 'user@example.com',
    password: userPassword,
    role: 'user',
  });
  console.log('✅ Created regular user:', user.email);

  // Create sample dealers
  const dealers = [
    {
      name: 'ABC Motors',
      email: 'abc@motors.com',
      phone: '+1-555-0101',
      address: '123 Main St, New York, NY 10001',
      operatingHours: '9:00 AM - 6:00 PM',
      status: 'ACTIVE',
      region: 'North',
    },
    {
      name: 'XYZ Auto Sales',
      email: 'xyz@autosales.com',
      phone: '+1-555-0102',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      operatingHours: '8:00 AM - 7:00 PM',
      status: 'ACTIVE',
      region: 'West',
    },
    {
      name: 'Premium Autos',
      email: 'premium@autos.com',
      phone: '+1-555-0103',
      address: '789 Elm St, Chicago, IL 60601',
      operatingHours: '10:00 AM - 5:00 PM',
      status: 'INACTIVE',
      region: 'Central',
    },
  ];

  await DealerModel.insertMany(dealers);
  console.log(`✅ Created ${dealers.length} dealers`);

  console.log('\n🎉 Database seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('User: user@example.com / user123');

  await app.close();
}

bootstrap();
