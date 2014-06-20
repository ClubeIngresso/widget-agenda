Widget de agenda do ClubeIngresso
=============

Widget de agenda de eventos do ClubeIngresso

## Usage

To use, you'll need to include the correct CSS and Javascript files into your HTML.
You can find the necessary files at [./agenda-clubeingresso.js](agenda-clubeingresso.js) and [./agenda-clubeingresso.css](agenda-clubeingresso.css) and include them in your HTML like so.

```html
<!-- in HEAD -->
<link rel="stylesheet" href="/path/to/agenda-clubeingresso.css">
<!-- at the end of BODY -->
<script src="/path/to/agenda-clubeingresso.js"></script>
```

Once you've included those files, you can initialize the widget.

```javascript
agendaClubeIngresso.init('#container', {
	'categoria': 'busca',
	'genero': 'Blues,Rock,Jazz',
	'cidade': 'Rio de Janeiro',
	'estado': 'RJ',
	'qtd': 10
});
```

## Lista de Generos
Para acessar a lista de generos [clique aqui](http://clubeingresso.com.br).

## Development

To contribute, read the [CONTIBUTING.md](CONTIBUTING.md):
