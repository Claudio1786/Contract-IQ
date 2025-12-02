import { NextRequest, NextResponse } from 'next/server';

// DELETE template by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const templateId = params.id;

  // In production, this would use Prisma:
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
  
  // await prisma.contractTemplate.update({
  //   where: { 
  //     id: templateId,
  //     userId: session.user.id 
  //   },
  //   data: { isActive: false }
  // });

  // For now, just return success
  return NextResponse.json({ success: true });
}