# InforMaster — site demonstrativo

Site de uma página feito para apresentar como proposta de portfólio para
a InforMaster (Ilhéus, BA). HTML, CSS e JS puros — sem build, sem
dependências pagas.

```
informaster-site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Antes de apresentar ao cliente

- Troque as fotos: hoje o site usa apenas ícones e cores, sem fotos reais
  da loja ou dos produtos. Peça ao dono fotos da fachada, do interior e
  de 2–3 produtos para substituir os cards de produto.
- Confirme telefone, endereço e horário — os dados aqui vieram do
  Instagram e do Google Maps públicos da loja, mas vale checar com o
  cliente antes de publicar de verdade.
- O texto de avaliações foi reescrito a partir de avaliações reais do
  Google; troque por avaliações atualizadas quando for publicar.

## 1. Ver o site localmente (VSCode)

1. Abra a pasta `informaster-site` no VSCode.
2. Instale a extensão **Live Server** (de Ritwick Dey).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
4. O navegador abre sozinho e atualiza a cada vez que você salvar um arquivo.

## 2. Subir para o GitHub

```bash
cd informaster-site
git init
git add .
git commit -m "primeira versão do site InforMaster"
```

Crie um repositório vazio no GitHub (sem README, sem .gitignore) e depois:

```bash
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/informaster-site.git
git push -u origin main
```

## 3. Publicar na Netlify (grátis)

**Opção mais rápida — arrastar e soltar:**
1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arraste a pasta `informaster-site` inteira para a página.
3. Pronto — a Netlify gera um link público em segundos.

**Opção recomendada — conectado ao GitHub (deploy automático):**
1. Em [app.netlify.com](https://app.netlify.com), clique em **Add new site → Import an existing project**.
2. Escolha **GitHub** e selecione o repositório `informaster-site`.
3. Deixe os campos de build em branco (não há build — é HTML puro) e clique em **Deploy**.
4. A cada `git push`, a Netlify republica o site sozinha.

Depois do primeiro deploy, em **Site configuration → Domain management**
dá pra trocar o endereço gerado (tipo `nome-aleatorio.netlify.app`) por
algo como `informaster.netlify.app`.

## Ideias para evoluir o projeto

- Trocar o mapa embutido por um com marcador customizado (Google Maps
  Embed API tem um plano gratuito generoso).
- Adicionar um formulário de contato usando o **Netlify Forms** (gratuito,
  não precisa de backend).
- Criar uma página `/produtos` separada, puxando os posts do Instagram
  via oEmbed pra manter a vitrine sempre atualizada sem editar código.
