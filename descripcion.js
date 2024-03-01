// Al cargar la página, obtén el ID del Pokémon de localStorage
const pokemonId = localStorage.getItem('pokemonId');

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
    case 'speed': return 'Velocidad';
    default: return estadistica;
  }
}

// Traduce el nombre del objeto o el método de evolución por amistad al español
function traducirEvolucionEspecial(trigger, item) {
  switch (trigger) {
    case 'level-up': return `Evoluciona al nivel ${item}`;
    case 'use-item':
      switch (item) {
        case 'oval-stone': return 'Evoluciona usando Piedra Oval';
        case 'moon-stone': return 'Evoluciona usando Piedra Lunar';
        case 'sun-stone': return 'Evoluciona usando Piedra Solar';
        case 'normal-gem': return 'Evoluciona usando Gema Normal';
        case 'super-gem': return 'Evoluciona usando Gema Super';
        case 'heart-scale': return 'Evoluciona usando Escala Corazón';
        case 'fire-stone': return 'Evoluciona usando Piedra Fuego';
        case 'thunder-stone': return 'Evoluciona usando Piedra Rayo';        
        case 'water-stone': return 'Evoluciona usando Piedra Agua';        
        case 'fire-stone': return 'Evoluciona usando Piedra Fuego';   
      
        default: return item; // Mantener el nombre original si no está traducido
      }
    case 'friendship': return 'Evoluciona con amistad';
    case 'trade': return 'Evoluciona en intercambio';
    default: return item;
  }
}

async function mostrarPokemon(id) {
  const pokemon = await obtenerPokemon(id);
  const especie = await obtenerEspecie(id);

  // Muestra la imagen, el nombre, el número de la Pokédex, el tipo, el peso y la altura del Pokémon.
  document.getElementById('pokemon-imagen').src = pokemon.sprites.other["official-artwork"].front_default;
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

  await mostrarCadenaEvolucion(especie.evolution_chain.url, cadenaEvolucionDiv, id);
}

async function mostrarCadenaEvolucion(url, cadenaEvolucionDiv, id) {
  const response = await fetch(url);
  const data = await response.json();

  await mostrarEvolucion(data.chain, cadenaEvolucionDiv, id);

  async function mostrarEvolucion(chain, cadenaEvolucionDiv, id) {
    const details = chain.evolution_details[0];
    const pokemon = await obtenerPokemon(chain.species.name);

    if (pokemon.id > 151) {
      return;
    }
    
    const divPokemon = document.createElement('div');
    const imagenPokemon = document.createElement('img');
    const nombrePokemon = document.createElement('p');
    const tipoPokemon = document.createElement('p');
    const evolucionPokemon = document.createElement('p');
    

    imagenPokemon.src = pokemon.sprites.other["official-artwork"].front_default;
    nombrePokemon.textContent = pokemon.name;
    tipoPokemon.textContent = pokemon.types.map(t => traducirTipo(t.type.name)).join(', ');
    evolucionPokemon.textContent = obtenerDetallesEvolucion(details);

    imagenPokemon.addEventListener('click', () => {
      mostrarPokemon(pokemon.id);
    });

    if (pokemon.id === id) {
      nombrePokemon.classList.add;('pokemon-actual')
    }

    divPokemon.appendChild(imagenPokemon);
    divPokemon.appendChild(nombrePokemon);
    divPokemon.appendChild(tipoPokemon);
    divPokemon.appendChild(evolucionPokemon);

    cadenaEvolucionDiv.appendChild(divPokemon);

    if (chain.evolves_to.length > 0) {
      for (const evolution of chain.evolves_to) {
        await mostrarEvolucion(evolution, cadenaEvolucionDiv, id);
      }
    }
  }

  function obtenerDetallesEvolucion(details) {
    if (details) {
      if (details.trigger.name === 'level-up') {
        return `Evoluciona al nivel ${details.min_level}`;
      } else if (details.trigger.name === 'use-item') {
        return `Evoluciona usando ${traducirEvolucionEspecial(details.trigger.name, details.item.name)}`;
      } else if (details.trigger.name === 'friendship') {
        return `Evoluciona con amistad`;
      }
    }
    return '';
  }
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

// Luego, muestra el Pokémon con ese ID
mostrarPokemon(pokemonId);
