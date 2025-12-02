import { NextRequest, NextResponse } from 'next/server';
import { uploadContractFileLocal } from '@/lib/upload';

// Mock user for development
const MOCK_USER_ID = 'user_123';

// In-memory storage for development
let templates: any[] = [];
let nextId = 1;

// GET all templates for user
export async function GET() {
  // In production, this would use Prisma:
  // const session = await getServerSession(authOptions);
  // const templates = await prisma.contractTemplate.findMany({
  //   where: { userId: session.user.id, isActive: true },
  //   orderBy: { createdAt: 'desc' }
  // });

  return NextResponse.json({ templates });
}

// POST new template
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const templateType = formData.get('templateType') as string;

  if (!file || !name) {
    return NextResponse.json({ error: 'File and name required' }, { status: 400 });
  }

  // Upload file (mocked for development)
  const { url } = await uploadContractFileLocal(file, MOCK_USER_ID, 'templates');

  // Create template record (in-memory for development)
  const template = {
    id: `template_${nextId++}`,
    userId: MOCK_USER_ID,
    name,
    description: description || null,
    templateType: templateType || 'custom',
    fileUrl: url,
    fileType: file.name.endsWith('.pdf') ? 'pdf' : 'docx',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  templates.push(template);

  // In production, this would use Prisma:
  // const template = await prisma.contractTemplate.create({
  //   data: {
  //     userId: session.user.id,
  //     name,
  //     description: description || null,
  //     templateType: templateType || 'custom',
  //     fileUrl: url,
  //     fileType: file.name.endsWith('.pdf') ? 'pdf' : 'docx'
  //   }
  // });

  return NextResponse.json({ template });
}

// DELETE template
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const templateId = pathParts[pathParts.length - 1];

  // Remove from in-memory storage
  templates = templates.filter(t => t.id !== templateId);

  // In production:
  // await prisma.contractTemplate.update({
  //   where: { id: templateId },
  //   data: { isActive: false }
  // });

  return NextResponse.json({ success: true });
}