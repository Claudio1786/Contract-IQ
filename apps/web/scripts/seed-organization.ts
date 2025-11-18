// Seed demo organization
// Run this once to create the demo organization that contracts reference

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedOrganization() {
  console.log('🌱 Seeding demo organization...')
  
  try {
    // Create demo organization
    const org = await prisma.organization.upsert({
      where: { id: 'demo-org' },
      update: {},
      create: {
        id: 'demo-org',
        name: 'Demo Organization',
        domain: 'demo.contractiq.com',
      },
    })
    
    console.log('✅ Demo organization created:', org)
    console.log('   ID:', org.id)
    console.log('   Name:', org.name)
    console.log('\n🎉 Seeding complete! You can now create contracts.')
    
  } catch (error) {
    console.error('❌ Error seeding organization:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedOrganization()
