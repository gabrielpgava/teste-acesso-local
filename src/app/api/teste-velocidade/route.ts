import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath = path.join(process.cwd(), 'public', 'arquivo-teste.bin');


export async function GET() {
  
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: 'Arquivo de teste não encontrado' },
      { status: 404 }
    );
  }

  const tamanhoDoArquivo = fs.statSync(filePath).size;
  const leituraStream = fs.createReadStream(filePath);

  const stream = new ReadableStream({
    start(controller) {
      leituraStream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });

      leituraStream.on('end', () => {
        controller.close(); 
      });

      leituraStream.on('error', (err) => {
        controller.error(err); 
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="arquivo-teste.bin"',
      'Content-Length': tamanhoDoArquivo.toString(),
    },
  });
}