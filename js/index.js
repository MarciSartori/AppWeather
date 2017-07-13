(function(){

	// Api de clima
	var apiKey = "5c729d3941b2e65bac850ddbfa36c536";
	var apiURL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + apiKey + "&";
	var imgClima = "http://openweathermap.org/img/w/";
	// Api de
	// Hora local 
	var today = new Date();
	var timeNow = today.toLocaleTimeString();

	//Para ahorrar llamadas y busquedas
	var $body = $("body");
	var $loader = $(".loader");
	var nombreNuevaCiudad = $("[data-input='cityAdd']");
	var btnAdd = $("[data-button='add']");
	var btnCiudades = $("[data-verciudad]");

	// Obj 
	var ciudades = [];
	var ciudadTiempo = {};
		ciudadTiempo.zona;
		ciudadTiempo.icono;
		ciudadTiempo.temp;
		ciudadTiempo.tempMax;
		ciudadTiempo.tempMin;
		ciudadTiempo.main;
		ciudadTiempo.humedad;
		ciudadTiempo.nubes;
		

	// Cuando click en boton Agregar ciudad	
	$( btnAdd ).on("click", agregarCiudad);
	
	// Agrego ciudad con ENTER
	$( nombreNuevaCiudad ).on("keypress", function(event){
		if(event.which == 13){
			agregarCiudad(event);
		}
	});

	// Cuando click en boton Ver Ciudades
	$( btnCiudades ).on("click", verCiudades);


	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getCoords, errorFound);


	} else {
		alert("Su navegador no es compatible");
	}
	function errorFound(error){
		alert("Ocurrio un error: "+ error.code);
		// 0 : Error desconocido
		// 1 : Permiso denegado
		// 2 : Posicion desconocida
		// 3 : Timeout
	}

	function getCoords(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		console.log("Posicion: "+ lat + ", "+ lon);
		$.getJSON(apiURL + "lat=" + lat + "&lon=" + lon, getTiempoActual);

	}

	function getTiempoActual(data){
		ciudadTiempo.zona = data.name;
		ciudadTiempo.icono = imgClima + data.weather[0].icon + ".png";
		ciudadTiempo.temp = data.main.temp - 273.15;
		ciudadTiempo.tempMax = data.main.temp_max - 273.15;
		ciudadTiempo.tempMin = data.main.temp_min - 273.15;
		ciudadTiempo.main = data.weather[0].main;
		ciudadTiempo.humedad = data.main.humidity;
		ciudadTiempo.nubes = data.clouds.all;
		renderTemplate(ciudadTiempo);
	}

	function activarTemplate(id){
		var t = document.querySelector(id);
		return document.importNode(t.content, true);
	}

	function renderTemplate(ciudadTiempo){
		var clone = activarTemplate("#template-ciudades");

		clone.querySelector("[data-tiempo]").innerHTML = timeNow;
		clone.querySelector("[data-ciudad]").innerHTML = ciudadTiempo.zona;
		clone.querySelector("[data-icono]").src = ciudadTiempo.icono;
		clone.querySelector("[data-temp='max']").innerHTML = ciudadTiempo.tempMax.toFixed(1);
		clone.querySelector("[data-temp='min']").innerHTML = ciudadTiempo.tempMin.toFixed(1);
		clone.querySelector("[data-temp='act']").innerHTML = ciudadTiempo.temp.toFixed(1);
		clone.querySelector("[data-temp='hum']").innerHTML = ciudadTiempo.humedad.toFixed(1);
		clone.querySelector("[data-nubes='nubes']").innerHTML = ciudadTiempo.nubes.toFixed(1);

		$( $loader ).hide();
		$( $body ).append(clone);
	}


	function agregarCiudad(event){
		event.preventDefault(); //Anula el evento del boton
		$.getJSON(apiURL + "q=" + $( nombreNuevaCiudad ).val(), getTiempoNuevaCiudad ); //Agrega la ciudad buscada
	}

	function getTiempoNuevaCiudad(data){
		
		$(nombreNuevaCiudad).val("");

		ciudadTiempo = {};
		ciudadTiempo.zona = data.name;
		ciudadTiempo.icono = imgClima + data.weather[0].icon + ".png";
		ciudadTiempo.temp = data.main.temp - 273.15;
		ciudadTiempo.tempMax = data.main.temp_max - 273.15;
		ciudadTiempo.tempMin = data.main.temp_min - 273.15;
		ciudadTiempo.humedad = data.main.humidity;
		ciudadTiempo.nubes = data.clouds.all;
		renderTemplate(ciudadTiempo);

		// Se guarda en localStorage (Hay que subirlo a Wamp)
		ciudades.push(ciudadTiempo);
		localStorage.setItem("cities", JSON.stringify(ciudades));
	}

	function verCiudades(event){
		event.preventDefault();

		function renderCiudades(cities){
			cities.forEach(function(city){
				renderTemplate(city);
			});
		};

		var cities = JSON.parse( localStorage.getItem("cities") );
		renderCiudades(cities);
	}

})();