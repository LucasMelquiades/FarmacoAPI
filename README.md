# 🌿 FarmacoAPI

Uma API estática em JSON com dados de plantas medicinais e termos técnicos, baseada no [Formulário de Fitoterápicos da Farmacopeia Brasileira (2ª edição)](https://www.gov.br/anvisa/pt-br/assuntos/farmacopeia/formulario-fitoterapico).

## 📦 Sobre o Projeto

Este repositório contém:

- Um banco de dados em `.json` com informações sobre espécies vegetais utilizadas na fitoterapia e um glossário de **generalidades farmacêuticas** para consulta de termos técnicos
- Uma **interface web** que exemplifica o uso da API e permite consultas interativas

## 🧬 Estrutura dos Dados

O arquivo JSON possui duas seções principais:

### 🌱 Plantas Medicinais

Cada planta contém:

- `id`
- `nome_cientifico`
- `nomes_populares`
- `modos_aplicacao` com:
  - `tipo`
  - `embalagem_e_armazenamento`
  - `formulas` com componentes, preparo, advertências, indicações e modo de usar

### 📖 Generalidades

Um glossário com termos técnicos relevantes:

- `id`
- `nome`
- `descricao`

## 🖼️ Imagens via Wikimedia Commons

A interface web utiliza a API da Wikimedia Commons para buscar imagens relacionadas aos nomes científicos e populares das plantas.

## 🌐 Interface Web

Uma aplicação web foi desenvolvida para exemplificar o uso da API, permitindo:

- Busca por nome científico ou popular
- Visualização das fórmulas e indicações
- Consulta ao glossário de generalidades
- Exibição de imagens relacionadas

## 🔗 Acesso à API

Você pode acessar o JSON diretamente via:

```code
https://raw.githubusercontent.com/LucasMelquiades/FarmacoAPI/refs/heads/main/js/farmacopeia.json
```

## ✨ Exemplos de Uso

Você pode consumir os dados com JavaScript, Python, ou qualquer linguagem que suporte requisições HTTP. Exemplo com `fetch`:

```code
fetch('https://raw.githubusercontent.com/LucasMelquiades/FarmacoAPI/refs/heads/main/js/farmacopeia.json')
  .then(res => res.json())
  .then(data => console.log(data.plantas));
```

## 📚 Fonte dos dados

Baseado no Formulário de Fitoterápicos da Farmacopeia Brasileira – 2ª edição.

## ⚠️ Aviso Legal

Este projeto tem fins educacionais e informativos. Consulte sempre um profissional de saúde antes de utilizar qualquer planta medicinal.

## 🛠️ Tecnologias Utilizadas

- JSON
- JavaScript
- GitHub Pages
- [Wikimedia Commons API](https://commons.wikimedia.org/wiki/Commons:API)
- [Sweetalert2](https://sweetalert2.github.io/)
- [Bootstrap](https://getbootstrap.com/)
- [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins) 

## 📈 Futuras Melhorias

- Tradução para outros idiomas
- Validação dos dados com JSON Schema
- Expansão da interface web

## 🤝 Contribuições

Este projeto é open source e está aberto a contribuições da comunidade!

- Faça um fork
- Crie uma branch
- Envie um pull request

## ✉️ Contato

Caso tenha dúvidas ou sugestões, entre em contato:

- Email: lucas-1106@hotmail.com

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Isso significa que você pode usar, modificar e distribuir livremente, desde que mantenha os créditos ao autor original.
