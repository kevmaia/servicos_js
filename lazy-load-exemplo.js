(function(){

	// como vamos usar o throttle varias vezes (no scroll e no resize), 
	// encapsulei essa funcionalidade numa função
	function throttle(fn) {
		fn.jarodei = false;
		
		return function(){
			if (fn.jarodei) return;
			fn.jarodei = true;
			setTimeout(function () { 
				fn.jarodei = false; 
			}, 200);

			fn();	
		};
	}

	// pega todas as imagens num array e pre-calcula seu topo
	var imgs = document.querySelectorAll('img[data-src]:not([src])');
	var cache, alturaJanela, scrollListener, resizeListener;

	function refazCache() {
		cache = [];

		// calcula os topos no cache
		for (var i = 0; i < imgs.length; i++) {
			cache.push({
				topo: imgs[i].getBoundingClientRect().top + pageYOffset,
				elemento: imgs[i]
			});
		}

		// ordena o cache pela imagem mais proxima do topo
		cache = cache.sort(function(a,b){
			return a.topo - b.topo;
		});

		// cache da altura da janela
		alturaJanela = window.innerHeight;
	}

	function carregaImagens() {
		// meu while não toca no DOM, observa apenas variáveis cacheadas e o pageYOffset.
		// só manipulo o DOM quando preciso realmente mexer na imagem.
		while (cache.length && cache[0].topo < pageYOffset + alturaJanela + 200) {
			var img = cache.shift().elemento;
			img.src = img.getAttribute('data-src');
		}

		// removo eventos se não precisar mais deles
		if (cache.length == 0) {
			window.removeEventListener('scroll', scrollListener);
			window.removeEventListener('resize', resizeListener);
		}
	}

	// roda primeira vez
	refazCache();
	carregaImagens();

	// onresize refazCache e carrega eventuais imagens
	window.addEventListener('resize', resizeListener = throttle(function() {
		refazCache();
		carregaImagens();
	}));

	// onscroll só carrega imagens
	window.addEventListener('scroll', scrollListener = throttle(carregaImagens));

})();
