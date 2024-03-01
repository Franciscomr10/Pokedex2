// Esta función obtiene los datos de un Pokémon específico de la API de PokeAPI.
async function obtenerPokemon(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  return datos;
}
// Esta función obtiene los datos de la especie de un Pokémon específico de la API de PokeAPI.
async function obtenerEspecie(id) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  return datos;
}

function traducirTipo(tipo) {
  switch (tipo) {
      case 'normal': return 'normal';
      case 'fighting': return 'lucha';
      case 'flying': return 'volador';
      case 'poison': return 'veneno';
      case 'ground': return 'tierra';
      case 'rock': return 'roca';
      case 'bug': return 'bicho';
      case 'ghost': return 'fantasma';
      case 'steel': return 'acero';
      case 'fire': return 'fuego';
      case 'water': return 'agua';
      case 'grass': return 'planta';
      case 'electric': return 'eléctrico';
      case 'psychic': return 'psíquico';
      case 'ice': return 'hielo';
      case 'dragon': return 'dragón';
      case 'dark': return 'siniestro';
      case 'fairy': return 'hada';
      default: return tipo;
  }
}
// Esta función traduce el nombre de una estadística del inglés al español
function traducirEstadistica(estadistica) {
  switch (estadistica) {
      case 'hp': return 'Vida';
      case 'attack': return 'Ataque';
      case 'defense': return 'Defensa';
      case 'special-attack': return 'Ata.Especial';
      case 'special-defense': return 'Def.Especial';
      case 'speed': return 'velocidad';
      default: return estadistica;
  }
}
// Esta función muestra los datos de un Pokémon específico en la página web.
async function mostrarPokemon(id) {
  const pokemon = await obtenerPokemon(id);
  const especie = await obtenerEspecie(id);
// Muestra la imagen, el nombre, el número de la Pokédex, el tipo, el peso y la altura del Pokémon.
  document.getElementById('pokemon-imagen').src = pokemon.sprites.front_default;
  document.getElementById('pokemon-nombre').textContent = pokemon.name;
  document.getElementById('pokedex-numero').textContent = pokemon.id;
  document.getElementById('tipo').textContent = pokemon.types.map(t => traducirTipo(t.type.name)).join(', ');
  document.getElementById('peso').textContent = pokemon.weight / 10;
  document.getElementById('altura').textContent = pokemon.height / 10;
// Muestra las estadísticas del Pokémon.
  const estadisticasDiv = document.getElementById('pokemon-estadisticas');
  estadisticasDiv.innerHTML = '';
  pokemon.stats.forEach(estadistica => {
      const div = document.createElement('div');
      const spanNombre = document.createElement('span');
      const spanValor = document.createElement('span');
      const divBarra = document.createElement('div');
      const divRelleno = document.createElement('div');

      spanNombre.textContent = traducirEstadistica(estadistica.stat.name);
      spanValor.textContent = estadistica.base_stat;
      divBarra.className = 'barra';
      divRelleno.className = 'relleno';
      divRelleno.style.width = `${(estadistica.base_stat / 225) * 100}%`;

      div.appendChild(spanNombre);
      div.appendChild(spanValor);
      div.appendChild(divBarra);
      divBarra.appendChild(divRelleno);

      estadisticasDiv.appendChild(div);
  });
// Muestra la cadena de evolución del Pokémon.
  const cadenaEvolucionDiv = document.getElementById('cadena-evolutiva');
  cadenaEvolucionDiv.innerHTML = '';
  let datosEvolucion = especie.evolution_chain.url;
  let idCadenaEvolucion = datosEvolucion.split('/')[6];
  const cadenaEvolucion = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${idCadenaEvolucion}`);
  let cadenaEvo = await cadenaEvolucion.json();

  do {
      const detallesEvolucion = cadenaEvo.chain['evolution_details'][0];

      const divPokemon = document.createElement('div');
      const imagenPokemon = document.createElement('img');
      const nombrePokemon = document.createElement('p');
      const tipoPokemon = document.createElement('p');
      const datosPokemon = await obtenerPokemon(cadenaEvo.chain.species.name);
      imagenPokemon.src = datosPokemon.sprites.front_default;
      nombrePokemon.textContent = datosPokemon.name;
      tipoPokemon.textContent = datosPokemon.types.map(t => traducirTipo(t.type.name)).join(', ');

      if (datosPokemon.id === id) {
          nombrePokemon.style.color = '#00f';
      }

      imagenPokemon.addEventListener('click', () => {
          mostrarPokemon(datosPokemon.id);
      });

      if (detallesEvolucion) {
        const p = document.createElement('p');
        p.textContent = `→ Evoluciona al nivel ${detallesEvolucion.min_level}`;
        cadenaEvolucionDiv.appendChild(p);
      }  else {
        nombrePokemon.classList.add('centrado');
      }

      divPokemon.appendChild(imagenPokemon);
      divPokemon.appendChild(nombrePokemon);
      divPokemon.appendChild(tipoPokemon);
      cadenaEvolucionDiv.appendChild(divPokemon);

      

      cadenaEvo.chain = cadenaEvo.chain['evolves_to'][0];
  } while (!!cadenaEvo.chain && cadenaEvo.chain.hasOwnProperty('evolves_to'));
}

document.getElementById('cambiar-tema').addEventListener('click', function() {
  const cuerpo = document.body;
  if (cuerpo.classList.contains('tema-oscuro')) {
      cuerpo.classList.remove('tema-oscuro');
      this.textContent = 'Cambiar a tema oscuro';
      localStorage.setItem('tema', 'claro');  // Guarda el tema en localStorage
  } else {
      cuerpo.classList.add('tema-oscuro');
      this.textContent = 'Cambiar a tema claro';
      localStorage.setItem('tema', 'oscuro');  // Guarda el tema en localStorage
  }
});

// Carga el tema guardado cuando se carga la página
window.addEventListener('load', function() {
  const temaGuardado = localStorage.getItem('tema');  // Obtiene el tema de localStorage
  if (temaGuardado === 'oscuro') {
      document.body.classList.add('tema-oscuro');
      document.getElementById('cambiar-tema').textContent = 'Cambiar a tema claro';
  }
}); 
mostrarPokemon(1);  