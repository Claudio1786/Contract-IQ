import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadContractFile(
  file: File,
  userId: string,
  folder: 'templates' | 'contracts' | 'redlines'
): Promise<{ url: string; path: string }> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${userId}/${folder}/${timestamp}_${safeName}`;
  
  const { data, error } = await supabase.storage
    .from('contracts')
    .upload(path, file, {
      contentType: file.type,
      upsert: false
    });
  
  if (error) throw new Error(`Upload failed: ${error.message}`);
  
  const { data: urlData } = supabase.storage
    .from('contracts')
    .getPublicUrl(path);
  
  return { url: urlData.publicUrl, path };
}

export async function extractTextFromPDF(fileUrl: string): Promise<string> {
  // Option 1: Use pdf-parse library
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(Buffer.from(buffer));
  return data.text;
}

// Alternative: For development/testing without Supabase
export async function uploadContractFileLocal(
  file: File,
  userId: string,
  folder: 'templates' | 'contracts' | 'redlines'
): Promise<{ url: string; path: string }> {
  // For local development, we'll just return a mock URL
  // In production, this would use Supabase or S3
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${userId}/${folder}/${timestamp}_${safeName}`;
  
  // In a real implementation, you would save the file to local storage
  // For now, we'll just return mock data
  return {
    url: `/uploads/${path}`,
    path: path
  };
}