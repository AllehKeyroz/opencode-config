# Comfy Image Generator Skill

Esta skill permite gerar imagens e vídeos usando a API do Comfy Cloud. O assistente pode criar workflows automaticamente a partir de descrições em linguagem natural.

## Quando usar

Use esta skill quando o usuário quiser:
- Gerar imagens via API do Comfy Cloud
- Gerar vídeos via API do Comfy Cloud
- Criar conteúdo visual usando a infraestrutura em nuvem do ComfyUI

## Funcionalidades

1. **Geração de Imagens** - Crie imagens a partir de prompts textuais
2. **Geração de Vídeos** - Crie vídeos a partir de descrições
3. **Configuração Avançada** - Ajuste parâmetros como seed, steps, cfg, modelo, etc.
4. **Download Automático** - Baixa as imagens/vídeos gerados automaticamente

## Como usar

Quando ativada, o assistente deve:

### Passo 1: Coletar informações do usuário

Faça estas perguntas ao usuário:

1. **Tipo de geração**: "Você quer gerar uma imagem ou um vídeo?"
2. **Prompt**: "Descreva o que você quer gerar"
3. **Modelo** (opcional): "Você quer usar algum modelo específico? (padrão: Flux)"
4. **Configurações avançadas** (opcional):
   - Seed (número ou "random")
   - Steps (quantidade de passos)
   - CFG Scale
   - Aspect ratio (1:1, 16:9, 9:16, etc.)
   - Estilo (fotorrealista, anime, artístico, etc.)

### Passo 2: Gerar o Workflow

Com base nas informações coletadas, gere um workflow JSON no formato API do ComfyUI. O assistente deve:

1. Construir o workflow dinamicamente com os nós necessários:
   - **Para imagens**: LoadImage (se input), CLIPTextEncode, KSampler, VAEDecode, SaveImage
   - **Para vídeos**: LoadImage, CLIPTextEncode, KSampler, VAEDecode, VideoCombine (VHS)

2. Usar os valores padrão sensatos se o usuário não especificar

### Passo 3: Enviar para a API

Execute o workflow usando a API do Comfy Cloud:

1. Configure as variáveis:
   ```python
   BASE_URL = "https://cloud.comfy.org"
   API_KEY = os.environ.get("COMFY_CLOUD_API_KEY")
   ```

2. Envie via POST /api/prompt:
   ```python
   response = requests.post(
       f"{BASE_URL}/api/prompt",
       headers={"X-API-Key": API_KEY, "Content-Type": "application/json"},
       json={"prompt": workflow}
   )
   prompt_id = response.json()["prompt_id"]
   ```

### Passo 4: Monitorar e Baixar

1. Monitore o status via WebSocket ou polling:
   - Endpoint: GET /api/job/{prompt_id}/status
   - Status possíveis: pending, in_progress, completed, failed

2. Após completar, baixe os arquivos:
   - GET /api/view?filename=...&type=output
   - Siga o redirect 302 para a URL signed

### Passo 5: Retornar ao usuário

Informe ao usuário:
- Que a geração foi concluída
- O prompt usado
- As configurações aplicadas
- O caminho do arquivo baixado

## Variáveis de Ambiente

A skill requer:
- `COMFY_CLOUD_API_KEY` - API key do Comfy Cloud (obtida em platform.comfy.org)

## Modelos Disponíveis

Por padrão, use Flux (disponível no Comfy Cloud). Outros modelos podem estar disponíveis:
- Stable Diffusion variants
- Modelos de vídeo (se disponíveis)

## Configurações Padrão

Se o usuário não especificar:
- Seed: random
- Steps: 20-30
- CFG: 7
- Aspect ratio: 1:1 (square)
- Estilo: automático baseado no prompt

## Tratamento de Erros

- Se API key não estiver configurada, peça ao usuário para definir COMFY_CLOUD_API_KEY
- Se o job falhar, informe o erro retornado pela API
- Timeout: 300 segundos (5 minutos)

## Exemplo de Conversa

**Assistente**: "O que você gostaria de gerar? Uma imagem ou vídeo?"
**Usuário**: "Uma imagem de um gato Astronauta no espaço"
**Assistente**: "Perfeito! Aqui estão as configurações que vou usar:
- Prompt: "astronaut cat in space, helmet, stars, cosmic, photorealistic"
- Modelo: Flux
- Aspect ratio: 1:1
- Steps: 25

Vou gerar agora..."

[Envia para API, espera, baixa e retorna]
**Assistente**: "Sua imagem foi gerada com sucesso! 
- Prompt usado: astronaut cat in space...
- Seed: 12345
- Arquivo salvo em: ./outputs/comfy_00001.png"

Quer que eu gere outra imagem ou ajuste algo?
