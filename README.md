Aplicativo criado para testar a conexão entre computadores na rede local.
Um dos computadores deve servir de servidor e os demais devem acessar o IPLOCAL:3000, para verificar que a conexão está acontecendo com sucesso.

Ele tem um pequeno speedtest imbutido para que possa se verificar se a velocidade na rede está satisfatoria, o teste é feito com o servidor que está hospedando o site na rede local


## Getting Started

### Executando a Aplicação

Para rodar a aplicação em modo de teste, utilize o seguinte comando:

```bash
npm run dev
```

### Criando o Arquivo de Teste

O arquivo de teste deve ser criado e colocado na pasta `public`. 
Para um teste local mais preciso, recomenda-se definir o `count` como 2000.

Exemplo de comando para criar um arquivo de 100 MB:

```bash
dd if=/dev/zero of=public/arquivo-teste.bin bs=1M count=100
```

Para usuarios do windows o dd.exe está localizado no `src/auxiliares`.
Demais plataformas é nativo do sistema
