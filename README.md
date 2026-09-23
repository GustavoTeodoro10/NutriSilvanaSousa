# Nutricionista Silvana Sousa — site one-page

Site de apresentação e conversão para a nutricionista **Silvana Sousa** (CRN 88583/P), com atendimento presencial em Mauá-SP e online. Todos os botões levam ao WhatsApp com mensagem pronta por seção.

- **Stack:** HTML + CSS + JavaScript puro, Tailwind CSS via CDN. Sem build, sem bundler, sem `npm install`.
- **Bibliotecas externas:** Tailwind (CDN) e Lenis (rolagem com inércia, carregado só em desktop, opcional).
- **Identidade:** paleta, logo, tom de voz e conteúdo extraídos do Instagram e do perfil no Google da cliente.
- **Criado por:** [TeoCode](https://teocode.com.br/)

## Estrutura do projeto

```
NutriSilvanaSousa/
├── index.html                 # página única (SEO, Open Graph, JSON-LD, todo o conteúdo)
├── site.webmanifest           # ícones e cor do tema (PWA leve)
├── robots.txt
├── README.md
├── .gitignore
└── assets/
    ├── css/
    │   └── styles.css         # tokens de cor/tipografia, componentes e animações
    ├── js/
    │   └── main.js            # reveal, trepadeira, parallax, FAQ, horários, WhatsApp, analytics
    └── img/
        ├── logo-silvana-sousa.png     # logo (recorte do Instagram, fundo transparente)
        ├── favicon.ico, favicon-16.png, favicon-32.png
        ├── apple-touch-icon.png, icon-192.png, icon-512.png   # gerados a partir do logo
        ├── og-image.jpg               # prévia ao compartilhar (1200×630)
        ├── silvana-retrato.webp       # hero
        ├── silvana-sobre.webp         # seção Sobre
        ├── silvana-cozinha.webp       # seção Sobre (detalhe)
        └── refeicoes.webp             # card de Reeducação alimentar
```

## Rodar localmente

Abra o `index.html` direto no navegador. Se preferir um servidor local (recomendado, para o mapa e as fontes se comportarem como em produção):

```bash
# Python
python -m http.server 5173

# ou Node
npx serve .
```

Depois acesse `http://localhost:5173`.

## Publicar (deploy)

Por ser 100% estático, qualquer hospedagem serve. Depois de publicar, faça os ajustes da seção **Antes de ir ao ar**.

| Hospedagem | Como |
|---|---|
| **GitHub Pages** | Suba o repositório, vá em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`. |
| **Netlify** | *Add new site → Import from Git* (ou arraste a pasta). Sem comando de build; diretório de publicação `.`. |
| **Vercel** | *Add New → Project*, importe o repositório. Framework: *Other*. Sem build. |
| **Cloudflare Pages** | Conecte o repositório. Build command vazio; output directory `/`. |
| **Hospedagem tradicional (cPanel/FTP)** | Envie todo o conteúdo da pasta para `public_html`. |

## Antes de ir ao ar

1. **Domínio.** Em `index.html`, troque `https://SEU-DOMINIO.com.br` (canonical, `og:url`, `og:image`, `twitter:image`) e em `robots.txt` descomente a linha do sitemap. Sem isso, a prévia do WhatsApp/Instagram não carrega a imagem.
2. **Google Analytics.** Em `assets/js/main.js`, no objeto `CONFIG`, troque `GA_MEASUREMENT_ID` pelo ID real (`G-XXXXXXXXXX`). Enquanto tiver `XXXX`, nada é enviado.
3. **Meta Pixel (opcional).** Preencha `META_PIXEL_ID` no mesmo objeto.
4. **Logo original.** O logo atual é um recorte de baixa resolução do Instagram (o desenho não foi alterado). Peça o PNG ou SVG original à Silvana e substitua `assets/img/logo-silvana-sousa.png`.
5. **Fotos originais.** As fotos vêm de posts do Instagram (até 640px). Peça fotos em alta resolução e substitua os arquivos `silvana-*.webp` e `refeicoes.webp`, mantendo os nomes.
6. **E-mail de contato.** Não foi encontrado nas redes, então **não aparece no rodapé**. Quando a Silvana informar, inclua um item na coluna "Contato" do `<footer>`.
7. **Valores dos planos.** Não existem nas redes. Os cards de Sessão pontual, 90 e 180 dias trazem "Valor sob consulta". Se a Silvana quiser exibir preços e o que cada plano inclui, edite a seção `#planos` do `index.html`.

## Rastreio de conversão

Cada clique em um botão de WhatsApp dispara o evento `generate_lead` (GA4) com `method: whatsapp` e o nome da seção (`section`). Com o Meta Pixel ativo, dispara também `Contact`. No GA4, marque `generate_lead` como evento de conversão.

## WhatsApp

O número fica em um único lugar de comportamento (`CONFIG.WHATSAPP` em `main.js`). As mensagens ficam em cada link, no atributo `data-wa`:

```html
<a href="https://wa.me/5511989300356" data-wa="Olá, Silvana! Vi o seu site e tenho interesse no Plano de 90 dias. Pode me passar os valores e como funciona?">
```

O `main.js` monta o link final com a mensagem codificada. Sem JavaScript, o link cai no WhatsApp sem texto pronto.

## Movimento e animação

| Padrão (referência dos sites-modelo) | Onde está |
|---|---|
| Reveal ao rolar (IntersectionObserver) | Atributo `data-reveal` (`up`, `left`, `right`, `scale`, `tilt`, `fade`) |
| Entrada orquestrada do hero | `[data-hero]` + `.is-loaded` (título por linhas, arco do retrato, chips) |
| Linha de progresso e círculos que "estouram" | `#como-comecar` (`.steps`, `.step-num`) |
| Marquee com pausa no hover | `.marquee` (faixa de áreas de atuação) |
| Hover em cards com mola | `.post`, `.svc`, `.plan`, `.rev` |
| Brilho diagonal no hover | `.btn::after`, `.svc::after`, `.plan::after` |
| Zoom em imagens | `.svc-photo img`, `.arch img`, `.frame-main img` |
| Acordeão | `.acc-btn` / `.acc-panel` (FAQ) |
| Nav que condensa ao rolar, menu mobile | `#nav`, `#menu` |
| Rolagem com inércia | Lenis, só desktop com mouse |
| **Assinatura própria:** trepadeira que cresce com a rolagem | `#vine` (montada em `main.js`) |

Mobile: sem parallax e sem Lenis. `prefers-reduced-motion` desliga todas as animações e o conteúdo aparece direto.

## Conteúdo e fontes

Todo o conteúdo veio de fontes públicas da cliente:

- **Instagram** [@nutrisilvanasousa](https://www.instagram.com/nutrisilvanasousa/): bio, CRN, frases dos posts, destaques, logo e fotos.
- **Perfil no Google** (Meu Negócio): endereço, telefone, horários (presencial seg–sex 10h–18h; online seg–sex 9h–17h), nota 5,0 e as 6 avaliações exibidas (14 no total, todas 5 estrelas, texto sem edição). Link para conferir: <https://share.google/jb1EK2HjXJ3xYR0Xa>.

Nada foi inventado. O que não existe nas redes (e-mail, preços, conteúdo dos planos, processo de atendimento, significado do Método MSS) não aparece no site.

## Paleta

Medida por amostragem de pixels do feed:

| Nome | Hex | Uso |
|---|---|---|
| Verde-mata | `#2C553C` | Verde do logo, botões, seções escuras |
| Mata profundo | `#0F2D1E` | Texto e rodapé |
| Oliva | `#768429` | Folhas, detalhes |
| Cáqui-sálvia | `#BDBE7A` | Fundo do hero e dos planos (dominante nos posts) |
| Sálvia | `#D5EBAD` | Superfícies claras |
| Creme | `#F6F6F2` | Fundo base |
| Ouro | `#B58E3F` | Garfo do logo, foco de teclado |

Tipografia: Fraunces (títulos) e Hanken Grotesk (texto), ambas do Google Fonts.

## Créditos

Site desenvolvido por [TeoCode](https://teocode.com.br/). © 2026 TeoCode.
