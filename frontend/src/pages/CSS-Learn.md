# CSS — Login Page: Guia de Estudo

Cada seção explica **o que faz** e **por que é necessário**.

---

## 1. Google Fonts via `@import`

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
```

**Por quê:**  
Carrega fontes externas diretamente no CSS, sem precisar adicionar uma tag `<link>` no HTML.  
- `wght@400;500;600` — importa apenas os pesos necessários (reduz o tamanho do download).  
- `ital,wght@0,300;1,300` — o `0` e `1` indicam normal e itálico respectivamente.  
- `display=swap` — exibe a fonte do sistema enquanto a custom carrega, evitando texto invisível (FOIT).

---

## 2. `.login-page` — Wrapper de página fullscreen

```css
.login-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
```

| Propriedade | Por que é necessária |
|---|---|
| `position: fixed` | Prende o elemento ao viewport, independente do scroll ou de estilos do `body`. Garante que a página de login cubra a tela inteira. |
| `inset: 0` | Atalho para `top: 0; right: 0; bottom: 0; left: 0`. Estica o elemento para preencher todo o espaço do pai posicionado (neste caso, o viewport). |
| `display: flex` | Ativa o Flexbox para centralizar o card filho. |
| `align-items: center` | Centraliza verticalmente no eixo cruzado do flex. |
| `justify-content: center` | Centraliza horizontalmente no eixo principal do flex. |
| `overflow: hidden` | Impede que as colinas que extrapolam as bordas (com `left: -25%`) criem scrollbars indesejadas. |

---

## 3. Background — Gradiente de paisagem em camadas

```css
background:
  radial-gradient(ellipse 65% 45% at 68% 18%, rgba(255, 232, 130, 0.38) 0%, transparent 55%),
  linear-gradient(180deg,
    #9ecfe8 0%,
    #bfe0d8 28%,
    ...
    #132e14 100%
  );
```

**Por quê:**  
CSS aceita múltiplos backgrounds separados por vírgula. Eles são empilhados de cima para baixo — o primeiro declarado fica na frente.

| Camada | Função |
|---|---|
| `radial-gradient` com cor amarelada | Simula um brilho solar difuso no canto superior direito. `ellipse 65% 45% at 68% 18%` define forma, tamanho e posição do foco. |
| `linear-gradient(180deg, ...)` | Gradiente vertical que simula o céu (azul claro) transitando para o verde do horizonte e depois para o verde escuro do primeiro plano. |

**Anatomia do `radial-gradient`:**
```
radial-gradient(
  ellipse      ← forma (circle ou ellipse)
  65% 45%      ← tamanho (largura e altura da elipse)
  at 68% 18%,  ← posição do centro (x% y%)
  cor1 0%,     ← início
  transparent 55% ← fim (fade para transparente)
)
```

---

## 4. `.hill` + `.hill-far/mid/near` — Colinas com `border-radius`

```css
.hill {
  position: absolute;
  bottom: 0;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
}

.hill-far {
  left: -25%;
  right: -5%;
  height: 42%;
  background: linear-gradient(180deg, #7dc87c 0%, #5aaa58 100%);
  border-radius: 55% 45% 0 0 / 100% 100% 0 0;
}
```

| Propriedade | Por que é necessária |
|---|---|
| `position: absolute` | Posiciona as colinas em relação ao `.login-page` (que é `fixed`). Sem isso, elas empurrariam o layout. |
| `bottom: 0` | Ancora a colina na base do viewport. |
| `left: -25%` | Permite que a colina comece fora da tela, criando a curva assimétrica de paisagem. |
| `height: 42%` | Altura relativa ao container, controlando o quanto da tela a colina ocupa. |
| `border-radius: 55% 45% 0 0 / 100% 100% 0 0` | A sintaxe completa do border-radius com dois grupos separados por `/`: o primeiro define os raios horizontais (canto-superior-esquerdo, canto-superior-direito, inferior-direito, inferior-esquerdo), o segundo define os raios verticais. Resultado: uma forma orgânica de colina. |

**Explicação do `border-radius` de dois grupos:**
```
border-radius: 55% 45% 0 0  /  100% 100% 0 0
               ↑ horizontal     ↑ vertical
```
Isso cria uma elipse assimétrica nos cantos superiores, simulando a curva irregular de uma colina.

**Por que 3 colinas separadas?**  
Cada uma tem `left`/`right` diferentes, criando sobreposição com perspectiva (longe → perto = mais clara → mais escura, mais baixa → mais alta).

---

## 5. `.login-card` — Glassmorphism

```css
.login-card {
  background: rgba(255, 255, 255, 0.13);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    0 24px 72px rgba(0, 0, 0, 0.25),
    0 4px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
  animation: slideUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

**Glassmorphism** é o efeito de vidro fosco. Requer 3 elementos juntos:

| Propriedade | Por que é necessária |
|---|---|
| `background: rgba(..., 0.13)` | Fundo semi-transparente. Sem transparência, o blur atrás não aparece. O valor `0.13` (13% opaco) deixa o conteúdo atrás visível. |
| `backdrop-filter: blur(28px)` | Aplica desfoque no que está **atrás** do elemento — é isso que cria o efeito de vidro. Sem isso, é só um painel transparente comum. |
| `backdrop-filter: saturate(160%)` | Aumenta a saturação do que está atrás, tornando as cores do fundo mais vivas através do vidro. Muito usado junto com blur para realismo. |
| `-webkit-backdrop-filter` | Prefixo necessário para Safari e browsers webkit mais antigos. Sem isso, o efeito não aparece no Safari. |
| `border: 1px solid rgba(255,255,255,0.28)` | Borda levemente visível que simula a borda de um vidro. Sem ela, o card parece "flutuar" sem definição. |
| `box-shadow` com 3 camadas | **1ª:** sombra difusa grande (profundidade geral). **2ª:** sombra menor e mais nítida (ancoragem). **3ª:** `inset 0 1px 0` — reflexo de luz branca na borda superior interna, completando o efeito de vidro. |

**Por que o `inset` no box-shadow faz diferença:**
```css
inset 0 1px 0 rgba(255, 255, 255, 0.45)
/* ↑ interno  ↑ apenas 1px abaixo do topo  ↑ branco semitransparente */
```
Cria um highlight sutil no topo do card, como luz refletindo em vidro.

---

## 6. `@keyframes slideUp` + `animation`

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: slideUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
```

| Parte | Por que é necessária |
|---|---|
| `from { opacity: 0; transform: translateY(28px) }` | Estado inicial: invisível e 28px abaixo da posição final. |
| `to { opacity: 1; transform: translateY(0) }` | Estado final: visível na posição normal. |
| `0.65s` | Duração. Rápido demais parece abrupto, lento demais parece pesado. ~600-700ms é o sweet spot para entradas de UI. |
| `cubic-bezier(0.22, 1, 0.36, 1)` | Curva de easing customizada — começa lento e termina com "overshooting" suave (efeito spring). Diferente do `ease-out` genérico, dá personalidade ao movimento. |
| `both` | Aplica o keyframe **antes** e **depois** da animação. Sem isso, o elemento aparece no estado final antes da animação começar. |

**Como ler um `cubic-bezier`:**
```
cubic-bezier(x1, y1, x2, y2)
```
Os 4 valores são os pontos de controle de uma curva de Bézier. Ferramentas como [cubic-bezier.com](https://cubic-bezier.com) permitem visualizar e criar curvas customizadas.

---

## 7. `.brand-icon` — Ícone com gradiente

```css
.brand-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #5bbf5b 0%, #2e8b34 100%);
  box-shadow: 0 6px 20px rgba(46, 139, 52, 0.45);
}
```

| Propriedade | Por que é necessária |
|---|---|
| `border-radius: 16px` | Cantos arredondados. `16px` num elemento de `56px` cria o estilo "squircle" (quadrado com cantos arredondados), comum em ícones modernos. |
| `linear-gradient(135deg, ...)` | `135deg` é diagonal (canto superior-esquerdo → inferior-direito). Gradientes diagonais em ícones dão mais profundidade que os verticais. |
| `box-shadow: ... rgba(46, 139, 52, 0.45)` | A cor da sombra usa a mesma matiz do ícone (verde), não preto. Sombras coloridas (em vez de preto) parecem mais naturais e integradas ao design. |

---

## 8. Inputs — Estilo glass + focus state

```css
.field-group input {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 12px;
  color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.field-group input:focus {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(134, 239, 172, 0.65);
  box-shadow: 0 0 0 3px rgba(134, 239, 172, 0.18);
}
```

| Propriedade | Por que é necessária |
|---|---|
| `background: rgba(..., 0.12)` | Continuidade do efeito glass dentro do card. Fundo transparente no input deixa o blur do card aparecer. |
| `color: #fff` | Sem isso, o texto digitado seria da cor padrão do browser (geralmente preto), invisível num fundo escuro. |
| `transition` em 3 propriedades | Anima suavemente border, sombra e fundo ao receber foco. Listar as propriedades individualmente (em vez de `transition: all`) é mais performático — o browser só rastreia o que muda. |
| `:focus` com `border-color` verde | Feedback visual claro de qual campo está ativo. Acessibilidade: usuários de teclado precisam ver o foco. |
| `:focus` com `box-shadow: 0 0 0 3px ...` | O `box-shadow` de `spread` cria um "halo" ao redor do input sem ocupar espaço no layout (diferente de `border` que empurra elementos). Padrão muito usado para focus rings customizados. |

**Por que `box-shadow` em vez de `outline` para o focus ring:**
```css
/* outline: afeta o layout em alguns casos, difícil de arredondar em browsers antigos */
outline: 3px solid green;

/* box-shadow: não afeta layout, respeita border-radius, mais flexível */
box-shadow: 0 0 0 3px rgba(134, 239, 172, 0.18);
```

---

## 9. `.btn-signin` — Botão branco

```css
.btn-signin {
  background: #fff;
  color: #2a6b30;
  border: none;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.btn-signin:hover {
  background: #dcfce7;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.btn-signin:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

| Estado | O que faz e por quê |
|---|---|
| `:hover` com `translateY(-1px)` | Sobe 1px ao passar o mouse — dá a sensação de que o botão "levanta". Movimento pequeno (1-2px) é mais elegante que valores maiores. |
| `:active` com `translateY(0)` | Volta à posição original ao clicar, simulando o botão sendo pressionado. A consistência entre hover e active cria micro-interação realista. |
| `box-shadow` crescente no hover | Sombra maior no hover reforça visualmente a elevação do `translateY`. As duas propriedades trabalham juntas para o mesmo efeito. |
| `border: none` | Botões têm borda padrão do browser. Necessário resetar para um visual limpo. |

---

## 10. `.register-prompt a` — Link com cor adequada ao fundo

```css
.register-prompt a {
  color: #a7f3b4;
  transition: color 0.15s ease;
}

.register-prompt a:hover {
  color: #dcfce7;
}
```

**Por quê `#a7f3b4` e não branco?**  
Links brancos sobre fundo branco-translúcido teriam baixo contraste. Verde claro (`#a7f3b4`) mantém a identidade cromática do projeto e tem contraste suficiente sobre o fundo escuro do card. No hover, clareia para `#dcfce7` dando feedback visual sem sair da paleta.

---

## Resumo: Padrões reutilizáveis

| Técnica | Onde aplicar |
|---|---|
| `position: fixed; inset: 0` | Qualquer página fullscreen (modais, loaders, splash screens) |
| Glassmorphism (`backdrop-filter + rgba bg + border rgba`) | Cards sobre imagens, sidebars, tooltips, modais |
| `border-radius` assimétrico com dois grupos (`X X X X / Y Y Y Y`) | Formas orgânicas, blobs, divisores de seção |
| `box-shadow` com `inset` para highlight | Botões, cards, inputs — efeito de luz interna |
| `cubic-bezier` customizado | Animações de entrada/saída com personalidade |
| Focus ring com `box-shadow: 0 0 0 Npx` | Inputs, botões — substitui `outline` com mais controle |
| Sombra colorida (mesma matiz do elemento) | Ícones, botões — mais natural que sombra preta |
| `transition` listando propriedades específicas | Qualquer hover/focus — mais performático que `transition: all` |
