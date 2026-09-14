# UrContab — mascote animado

Extraia o ZIP e abra index.html no navegador. Não precisa instalar dependências, criar conta ou usar internet.

## Interações
- Clique na coruja ou em Acenar: a asa acena e a cabeça acompanha.
- Pensar: inclinação da cabeça e gesto com a asa.
- Consultar tablet: levanta o tablet e olha para ele.
- Piscar: piscadela com o olho direito.
- Celebrar uma meta: saltos, aceno e confetes.
- Pedir uma dica: mensagem acompanhada de movimento de cabeça e bico.
- Movimento suave de respiração, piscar espontâneo e consulta periódica ao tablet.
- Pausar movimentos: interrompe animações e confetes.

Respeita a preferência de movimento reduzido do dispositivo. Animações param quando a página fica oculta. Funciona com mouse, toque e teclado. Tema claro/escuro com preferência salva quando o navegador permite.

## Arte e integração
A imagem fornecida Mascote.png é a fonte visual, incluindo a logo exata no peito. O personagem é articulado em SVG com recortes vetoriais da imagem, sem fundo branco retangular. Trata-se de animação 2D para o site, não de vídeo ou modelo 3D.

Arquivos:
- index.html: página e SVG articulado incorporado.
- styles.css: estilo base da página.
- animation.css: articulações, gestos e ajustes responsivos.
- motion.js: interações e controle de animação.
- assets/mascote.png: referência original, sem alteração de pixels.
- rig.svg: fonte do recorte vetorial (as animações estão na página).

Para integrar em outro site, copie o SVG e a estrutura necessária, mantenha a imagem e adapte os seletores do JavaScript. IDs do SVG devem ser únicos na página. Alterações em rig.svg precisam ser replicadas no SVG incorporado em index.html.

Os indicadores são ilustrativos; esta demonstração não consulta contas ou dados financeiros reais. Falas são exibidas em texto, sem áudio.
