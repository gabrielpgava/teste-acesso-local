'use client';
import { useState } from 'react';

interface SpeedData {
    fileSize: string;
    speed: string;
    timeTaken: string;
    progress: string;
}

export default function SpeedTest() {
    const [speedData, setSpeedData] = useState<SpeedData | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    async function testDownloadSpeed() {
        try {
            setIsDownloading(true);

            const respostaMeta = await fetch('/api/teste-velocidade', { method: 'HEAD' });
            if (!respostaMeta.ok) {
                console.error('Erro ao obter metadados do arquivo');
                setIsDownloading(false);
                return;
            }

            const fileSize = parseInt(respostaMeta.headers.get('Content-Length') || '0', 10);
            if (!fileSize) {
                console.error('Tamanho do arquivo não encontrado nos cabeçalhos');
                setIsDownloading(false);
                return;
            }

            const inicio = performance.now();
            let tamanhoBaixado = 0;

            const downloadResponse = await fetch('/api/teste-velocidade');
            const reader = downloadResponse.body?.getReader();

            if (!reader) {
                console.error('Erro ao obter o leitor do stream');
                setIsDownloading(false);
                return;
            }

            const chunks: Uint8Array[] = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                if (value) {
                    chunks.push(value);
                    tamanhoBaixado += value.length;

                    const progress = ((tamanhoBaixado / fileSize) * 100).toFixed(2);
                    const elapsedTime = (performance.now() - inicio) / 1000;
                    const speed = (tamanhoBaixado * 8 / elapsedTime) / (1024 * 1024);

                    setSpeedData({
                        fileSize: (fileSize / (1024 * 1024)).toFixed(2),
                        speed: speed.toFixed(2),
                        timeTaken: elapsedTime.toFixed(2),
                        progress: progress,
                    });
                }
            }

            const endTime = performance.now();
            const timeTaken = (endTime - inicio) / 1000;

            const blob = new Blob(chunks);

            setSpeedData((prev) => ({
                ...prev!,
                timeTaken: timeTaken.toFixed(2),
                progress: '100.00',
            }));
        } catch (error) {
            console.error('Erro durante o teste de velocidade:', error);
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <div className='self-center flex flex-col items-center justify-center border-2 border-gray-300 p-4 rounded-md shadow-md'>
            <h1>Teste de Velocidade Local</h1>
            <br />
            <button
                onClick={testDownloadSpeed}
                className="self-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isDownloading}
            >
                {isDownloading ? 'Baixando...' : 'Iniciar Teste'}
            </button>

            <br />
            {speedData && (
                <div className='border-2 border-gray-300 p-4 rounded-md shadow-md'>
                    <p><strong>Tamanho do Arquivo:</strong> {speedData.fileSize} MB</p>
                    <p><strong>Velocidade:</strong> {speedData.speed} Mb/s</p>
                    <p><strong>Tempo de Transferência:</strong> {speedData.timeTaken} segundos</p>
                    <p><strong>Progresso:</strong> {speedData.progress}%</p>
                </div>
            )}
        </div>
    );
}
