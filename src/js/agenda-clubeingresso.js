var agendaClubeIngresso = (function() {
	'use strict';

	var widgetAgenda, pluginContainer,
		apiUrl = 'http://api.clubeingresso.com.br',
		s = {
			'categoria': 'busca',
			'cidade': false,
			'estado': false,
			'genero': false,
			'qtd': 10
		};

	function extend() {
		var src,
			copyIsArray,
			copy,
			name,
			options,
			clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if ( typeof target === 'boolean' ) {
			deep = target;
			target = arguments[ i ] || {};
			i++;
		}

		if ( typeof target !== 'object' && typeof target !== 'function' ) {
			target = {};
		}

		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {
			if ( (options = arguments[ i ]) != null ) {
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					if ( target === copy ) {
						continue;
					}

					if (
						deep &&
						copy &&
						(
							(
								typeof copy !== 'object' ||
								copy.nodeType ||
								(copy != null && copy === copy.window)
							) ||
							( copyIsArray = Array.isArray(copy) )
						)
					) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];
						} else {
							clone = (
								src &&
								(
									typeof src !== 'object' ||
									src.nodeType ||
									(src != null && src === src.window)
								)
							) ? src : {};
						}

						target[ name ] = this.extend( deep, clone, copy );

					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
		return target;
	}

	widgetAgenda = {

		init: function(container, userSettings) {

			extend(s, userSettings);
			pluginContainer = document.querySelector(container);

			var hasInitError = this.handlerInitErrors();

			if(!hasInitError){
				this.buildWidget();
				this.callAjax();
			}
		},

		handlerInitErrors: function() {
			if(
				s.categoria !== 'busca' &&
				s.categoria !== 'show' &&
				s.categoria !== 'festa' &&
				s.categoria !== 'esporte' &&
				s.categoria !== 'teatro'
			) {
				console.error('Categoria Inválida');
				return true;
			}

			if(!pluginContainer) {
				console.error('Container Inválido');
				return true;
			}

			if(s.cidade && s.estado) {
				console.error('Você não pode usar uma cidade e um estado juntos como parametro');
				return true;
			}

			return false;
		},

		buildWidget: function() {
			var widgetHtml,
				tituloWidget = 'Ingressos';

			if(s.genero){
				tituloWidget = tituloWidget+' de '+s.genero;
			}

			if(s.cidade || s.estado){
				tituloWidget = tituloWidget+' - '+(s.estado || s.cidade);
			}

			widgetHtml = '<div class="widgetClubeIngresso">\
				<div class="wci-header">'+tituloWidget+'</div>\
				<div class="wci-container">\
					<img class="wci-loading" src="https://s3.amazonaws.com/clubeingresso/widget/loading.gif" width="30" height="28" alt="Carregando apresentações..." title="Carregando apresentações...">\
				</div>\
				<p class="wci-footer">Plugin social <a href="http://clubeingresso.com.br" target="_blank">ClubeIngresso</a></p>\
			</div>';

			pluginContainer.innerHTML = widgetHtml;

		},

		callAjax: function() {
			var request = new XMLHttpRequest(),
				self = this,
				generoUrl = '', cidadeUrl = '', estadoUrl = '', categoriaUrl = '';

			if(s.genero){
				generoUrl = '&genero='+s.genero;
			}

			if(s.cidade){
				cidadeUrl = '&cidade='+s.cidade;
			}

			if(s.estado){
				estadoUrl = '&estado='+s.estado;
			}

			if(s.categoria !== 'busca'){
				categoriaUrl = '&genero='+s.genero;
			}

			request.open('GET', apiUrl+'/busca?busca=&pagina=1&perpage='+s.qtd+generoUrl+cidadeUrl+estadoUrl+categoriaUrl, true);

			request.onreadystatechange = function() {
				var data,
					hasError = true;

				if (this.readyState === 4){
					if (this.status >= 200 && this.status < 400){
						data = JSON.parse(request.responseText);
						if(data.success === true){
							self.buildListaApresentacoes(data.result);
							hasError = false;
						}
					}

					if(hasError){
						document.querySelector('.wci-container').innerHTML = '<ul><li class="wci-zeroEvents">Desculpe, ocorreu um erro.<br> Visite o <a href="http://clubeingresso.com.br/">ClubeIngresso</a> para ver os ultimos eventos na integra</li></ul>';
					}
				}

			};

			request.send(null);
			request = null;
		},

		buildListaApresentacoes: function(arrayApresentacoes) {
			var listaAprensetacoes = '<ul>',
				self = this;

			if(arrayApresentacoes.length){
				arrayApresentacoes.forEach(function(el) {
					var permalink = self.buildPermalink(el),
						data = self.trataData(el.data);

					listaAprensetacoes += '<li>\
						<a href="'+permalink+'" title="'+el.evento+'">\
							<img class="wci-foto" src="https://s3.amazonaws.com/shows.eventos.clubeingresso.com.br/imagens/'+el.foto+'" alt="'+el.evento+'" title="'+el.evento+'">\
							<div class="wci-infos">\
								<div class="wci-title">'+el.evento+'</div>\
								<div class="wci-info">\
									'+el.cidade+'/'+el.estado+'<br>\
									'+data+'\
								</div>\
							</div>\
						</a>\
					</li>';
				});
			} else {
				listaAprensetacoes += '<li class="wci-zeroEvents">Desculpe, não existem eventos próximos</li>';
			}

			listaAprensetacoes += '</ul>';

			document.querySelector('.wci-container').innerHTML = listaAprensetacoes;
		},

		buildPermalink: function(apresentacao) {
			var permalinkBase = 'http://clubeingresso.com.br/',
				secaoPermalink;

			switch (apresentacao.secao) {
			case 'Shows':
				secaoPermalink = 'show';
				break;
			case 'Festas':
				secaoPermalink = 'festa';
				break;
			case 'Esporte':
				secaoPermalink = 'esporte';
				break;
			case 'Teatro':
				secaoPermalink = 'teatro';
				break;
			}

			return permalinkBase+secaoPermalink+'/'+apresentacao.permalink;
		},

		trataData: function(data) {
			var dia = new Date(data).getUTCDate(),
				mes = new Date(data).getUTCMonth(),
				ano = new Date(data).getUTCFullYear(),
				mesArray = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ];

			return dia+' de '+mesArray[mes]+' de '+ano;
		}

	};

	return widgetAgenda;
})();

window.agendaClubeIngresso = Object.create(agendaClubeIngresso);
