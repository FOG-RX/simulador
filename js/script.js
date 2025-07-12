let preguntas = [];

async function cargarPreguntas() {
  const response = await fetch('data/preguntas.json');
  preguntas = await response.json();
  iniciarSimulador();
}

function iniciarSimulador() {
  const formulario = document.getElementById('formulario');
  formulario.innerHTML = '';
  const seleccionadas = preguntas.sort(() => 0.5 - Math.random()).slice(0, 20);
  seleccionadas.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'pregunta';

    const pregunta = document.createElement('p');
pregunta.innerHTML = `${i + 1}.- ${p.question.replace(/\n/g, '<br>')}`;
    div.appendChild(pregunta);

    const imgContainer = document.createElement('div');
    div.appendChild(imgContainer);

    const img = new Image();
    img.src = `img/pregunta_${p.originalIndex}.png`;
    img.onload = () => imgContainer.appendChild(img);

    p.options.forEach((opcion, idx) => {
      const label = document.createElement('label');
      label.className = 'opcion';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'p' + i;
      input.value = idx;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + String.fromCharCode(97 + idx) + ') ' + opcion));
      div.appendChild(label);
    });

    formulario.appendChild(div);
  });
  iniciarTemporizador();
}

function revisar() {
  const preguntasHTML = document.querySelectorAll('.pregunta');
  let correctas = 0;

  preguntasHTML.forEach((bloque, i) => {
    const inputs = bloque.querySelectorAll('input[type=radio]');
    inputs.forEach((input, idx) => {
      const label = input.parentElement;
      if (idx === preguntas[i].correct) {
        label.classList.add('correcta');
        label.insertAdjacentHTML('beforeend', ' ✔️');
        if (input.checked) correctas++;
      } else if (input.checked) {
        label.classList.add('incorrecta');
        label.insertAdjacentHTML('beforeend', ' ❌');
      }
      input.disabled = true; // desactiva las opciones al terminar
    });
  });

  const resultadoTexto = `Resultado: ${correctas} / 20 correctas`;
  const aprobado = correctas >= 18 ? '✅ Aprobado' : '❌ No aprobado';

  document.getElementById('resultado').innerHTML = `
    <p>${resultadoTexto}</p>
    <p><strong>${aprobado}</strong></p>
  `;
}


function reiniciar() {
  cargarPreguntas();
  document.getElementById('resultado').textContent = '';
}

let tiempoRestante = 20 * 60;
let temporizador;

function iniciarTemporizador() {
  clearInterval(temporizador);
  tiempoRestante = 20 * 60;
  actualizarTemporizador();
  temporizador = setInterval(() => {
    tiempoRestante--;
    actualizarTemporizador();
  if (tiempoRestante <= 0) {
  clearInterval(temporizador);
  revisar();
  document.getElementById('resultado').insertAdjacentHTML('afterbegin', '<p><strong>⏱️ Se acabó el tiempo</strong></p>');
  }
  }, 1000);
}

function actualizarTemporizador() {
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  document.getElementById('timer').textContent = 'Tiempo restante: ' + minutos + ':' + (segundos < 10 ? '0' : '') + segundos;
}

window.onload = cargarPreguntas;
