const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");
const searchInput = document.getElementById("search-input");
const dropdown = document.getElementById("dropdown");
const clearBtn = document.getElementById("clear-btn");
const searchResults = document.getElementById("search-results");

// Función de ordenamiento personalizada
function sortLines(a, b) {
  return a.localeCompare(b);
}

// Función para cargar el contenido del archivo desde el almacenamiento web
function loadFileFromStorage() {
  const fileContent = localStorage.getItem('fileContent');
  const fileName = localStorage.getItem('fileName');
  const lineCount = localStorage.getItem('lineCount');
  if (fileContent) {
    const lines = fileContent.split("\n");
    lines.sort(sortLines); // Ordenar el contenido alfabéticamente usando la función de ordenamiento personalizada
    dropdown.innerHTML = "";

    for (let line of lines) {
      if (line.trim() !== "") {
        const option = document.createElement("option");
        option.value = line;
        option.text = line;
        dropdown.add(option);
      }
    }
    customTxt.innerHTML = `${fileName} (${lineCount})`; /*parentesis (123) numeros arch */
  } else {
    customTxt.innerHTML = "Lista no cargada.";
  }
}

// Cargar el contenido del archivo desde el almacenamiento web al cargar la página
loadFileFromStorage();

customBtn.addEventListener("click", function() {
  realFileBtn.click();
});

realFileBtn.addEventListener("change", function() {
  if (realFileBtn.value) {
    const fileName = realFileBtn.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
    readFileAndPopulateDropdown(realFileBtn.files[0], fileName);
  } else {
    customTxt.innerHTML = "Lista no cargada.";
    dropdown.innerHTML = "";
    searchResults.innerHTML = "";
    localStorage.removeItem('fileContent');
    localStorage.removeItem('fileName');
    localStorage.removeItem('lineCount');
  }
});

function readFileAndPopulateDropdown(file, fileName) {
  const reader = new FileReader();

  reader.onload = function() {
    const lines = reader.result.split("\n");
    const lineCount = lines.filter(line => line.trim() !== "").length;
    lines.sort(sortLines); // Ordenar el contenido alfabéticamente usando la función de ordenamiento personalizada
    dropdown.innerHTML = "";

    for (let line of lines) {
      if (line.trim() !== "") {
        const option = document.createElement("option");
        option.value = line;
        option.text = line;
        dropdown.add(option);
      }
    }

    // Almacenar el contenido del archivo, el nombre del archivo y el número de líneas en el almacenamiento web
    localStorage.setItem('fileContent', reader.result);
    localStorage.setItem('fileName', fileName);
    localStorage.setItem('lineCount', lineCount);

    customTxt.innerHTML = `${fileName} (${lineCount})`;
  };

  reader.readAsText(file);
}

clearBtn.addEventListener("click", function() {
  customTxt.innerHTML = "Lista no cargada.";
  dropdown.innerHTML = "";
  searchResults.innerHTML = "";
  localStorage.removeItem('fileContent');
  localStorage.removeItem('fileName');
  localStorage.removeItem('lineCount');
});

// Función para filtrar las opciones del dropdown
function filterOptions() {
  const searchTerm = searchInput.value.toLowerCase();
  const options = dropdown.options;
  let hasMatches = false;

  // Resetear estilos si no hay entrada en el cuadro de búsqueda
  if (searchTerm === "") {
    searchInput.classList.remove('has-matches', 'no-matches');
    dropdown.classList.remove('has-matches', 'no-matches');
    searchResults.innerHTML = "";
    location.reload(); //recargar pagina
    document.getElementById("search-input").focus();//deja posicionado encursor in entrada buscador
    return;
  }

  // Limpiar la primera opción si no coincide con el término de búsqueda
  if (options.length > 0 && !options[0].text.toLowerCase().includes(searchTerm)) {
    options[0].style.display = 'none';
  }

  // Mostrar los resultados en el recuadro `search-results`
  searchResults.innerHTML = "";
  const matchingOptions = [];
  for (let i = 1; i < options.length; i++) {
    const option = options[i];
    const optionText = option.text.toLowerCase();
    if (optionText.includes(searchTerm)) {
      option.style.display = 'block';
      hasMatches = true;
      matchingOptions.push(option.text);
    } else {
      option.style.display = 'none';
    }
  }

  // Mostrar los resultados en el recuadro
  for (let match of matchingOptions) {
    const matchElement = document.createElement("div");
    matchElement.textContent = match;
    searchResults.appendChild(matchElement);
  }

  // Desplegar el dropdown si hay elementos que coincidan con el término de búsqueda
  if (dropdown.options.length > 0) {
    dropdown.size = Math.min(dropdown.options.length, 0); // Establecer el tamaño del dropdown a un máximo de 10 elementos
  } else {
    dropdown.size = 0; // Ocultar el dropdown si no hay elementos que coincidan
  }

 
  
  // Cambiar el color de fondo del dropdown según si hay coincidencias o no
  dropdown.classList.remove('has-matches', 'no-matches');
  searchInput.classList.remove('has-matches', 'no-matches');
  if (hasMatches) {
    dropdown.classList.add('has-matches');
    // searchInput.classList.add('has-matches');
  } else {
    dropdown.classList.add('no-matches');
    // searchInput.classList.add('no-matches');
    
  }
}

// Escuchar el evento input en el cuadro de búsqueda
searchInput.addEventListener("input", filterOptions);



// START CLOCK SCRIPT
Number.prototype.pad = function(n) {
  for (var r = this.toString(); r.length < n; r = 0 + r);
  return r;
};

function updateClock() {
  var now = new Date();
  var milli = now.getMilliseconds(),
    sec = now.getSeconds(),
    min = now.getMinutes(),
    hou = now.getHours(),
    mo = now.getMonth(),
    dy = now.getDate(),
    yr = now.getFullYear();
    
  var days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Novimbre", "Diciembre"];
  var tags = ["day", "mon", "d", "y", "h", "m", "s", "mi"],
    corr = [days[now.getDay()], months[mo], dy, yr, hou.pad(2), min.pad(2), sec.pad(2), milli];
  for (var i = 0; i < tags.length; i++)
    document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
}

function initClock() {
  updateClock();
  window.setInterval("updateClock()", 1);
}

initClock(); // Llamada a la función para iniciar el reloj al cargar la página
// END CLOCK SCRIPT
document.getElementById("search-input").focus();//deja posicionado encursor in entrada buscador


//posiciona en el cuadro de busquedas al recargar pagina
  //window.onload = function() {
  //  document.getElementById("search-input").focus();
  //};

  
    
  
