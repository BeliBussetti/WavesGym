let clientes = {};
let mesCopiado = null;
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const cargarMeses = () => {
    const mesesContainer = document.getElementById('meses');
    meses.forEach((mes, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = mes;
        card.addEventListener('click', () => {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            mostrarFormularioNuevoCliente(index + 1, mes);
        });
        mesesContainer.appendChild(card);
    });
};

const mostrarFormularioNuevoCliente = (mesIndex, mes) => {
    const contenido = document.getElementById('contenido');
    contenido.dataset.mes = mesIndex;
    contenido.classList.remove('hidden');
    contenido.innerHTML = `
        <h2>Clientes inscritos en ${mes}</h2>
        <form id="clientForm">
            <label for="nombre">Nombre y Apellido:</label>
            <input type="text" id="nombre" name="nombre" required>
            
            <div id="diasHorariosContainer">
                <div class="diaHorario">
                    <label for="dia">Día:</label>
                    <select name="dia" class="dia">
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                    </select>
                    <label for="horario">Horario:</label>
                    <select name="horario" class="horario">
                        <option value="7:00">7:00</option>
                        <option value="8:00">8:00</option>
                        <option value="9:00">9:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                    </select>
                    <button type="button" onclick="agregarDiaHorario()">Agregar día</button>
                </div>
            </div>
            
            <div>
                <label><input type="radio" name="pago" value="pagado"> Pago</label>
                <label><input type="radio" name="pago" value="aPagar"> A pagar</label>
            </div>

            <button type="submit" id="inscribirBtn">Inscribir Cliente</button>
        </form>
        
        <div id="horariosSemana">
            ${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => `
                <div class="dia">
                    <h3>${dia}</h3>
                    <div class="horarios">
                        ${['7:00', '8:00', '9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(hora => `
                            <div class="horario">
                                <span>${hora}</span>
                                <div id="${dia}_${hora.replace(':', '')}"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const clientForm = document.getElementById('clientForm');
    clientForm.addEventListener('submit', manejarFormularioCliente);

    actualizarHorarios(mesIndex);
};

const agregarDiaHorario = () => {
    const container = document.getElementById('diasHorariosContainer');
    if (container.children.length >= 5) return;

    const diaHorarioDiv = document.createElement('div');
    diaHorarioDiv.classList.add('diaHorario');
    diaHorarioDiv.innerHTML = `
        <label for="dia">Día:</label>
        <select name="dia" class="dia">
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
        </select>
        <label for="horario">Horario:</label>
        <select name="horario" class="horario">
            <option value="7:00">7:00</option>
            <option value="8:00">8:00</option>
            <option value="9:00">9:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
        </select>
        <button type="button" onclick="agregarDiaHorario()">Agregar día</button>
    `;
    container.appendChild(diaHorarioDiv);
};

const manejarFormularioCliente = (event) => {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const diasHorarios = Array.from(document.querySelectorAll('.diaHorario')).map(dh => ({
        dia: dh.querySelector('.dia').value,
        horario: dh.querySelector('.horario').value
    }));
    const pago = document.querySelector('input[name="pago"]:checked').value;
    const mes = document.getElementById('contenido').dataset.mes;
    
    if (!nombre || diasHorarios.length === 0 || !pago) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    if (!clientes[mes]) {
        clientes[mes] = [];
    }

    let clienteExistente = clientes[mes].find(c => c.nombre === nombre);
    if (clienteExistente) {
        clienteExistente.diasHorarios.push(...diasHorarios);
        clienteExistente.pago = pago; // Actualiza el estado de pago si es necesario
    } else {
        clientes[mes].push({ nombre, diasHorarios, pago });
    }

    // Guardar en localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Actualizar la vista de horarios
    actualizarHorarios(mes);
    
    alert('Cliente agregado exitosamente.');
    mostrarFormularioNuevoCliente(mesIndex, mes);
};

const actualizarHorarios = (mes) => {
    const clientesMes = clientes[mes] || [];
    document.querySelectorAll('.horarios div[id]').forEach(div => div.innerHTML = ''); // Limpiar horarios
    clientesMes.forEach(cliente => {
        cliente.diasHorarios.forEach(({ dia, horario }) => {
            const id = `${dia}_${horario.replace(':', '')}`;
            const div = document.getElementById(id);
            if (div) {
                const clienteDiv = document.createElement('div');
                clienteDiv.textContent = cliente.nombre;
                div.appendChild(clienteDiv);
            }
        });
    });
};

const guardarDatos = () => {
    const blob = new Blob([JSON.stringify(clientes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.json';
    a.click();
};

const cargarDatos = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        clientes = JSON.parse(e.target.result);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        const mes = document.getElementById('contenido').dataset.mes;
        if (mes) {
            actualizarHorarios(mes);
        }
    };
    reader.readAsText(file);
};

const cancelar = () => {
    const contenido = document.getElementById('contenido');
    contenido.classList.add('hidden');
    contenido.innerHTML = '';
};

// Funciones para copiar y pegar información de un mes
const copiarMes = () => {
    const mes = document.getElementById('contenido').dataset.mes;
    if (mes) {
        mesCopiado = JSON.parse(JSON.stringify(clientes[mes] || []));
        alert('Información del mes copiada.');
    }
};

const pegarMes = () => {
    const mes = document.getElementById('contenido').dataset.mes;
    if (mes && mesCopiado) {
        clientes[mes] = JSON.parse(JSON.stringify(mesCopiado));
        localStorage.setItem('clientes', JSON.stringify(clientes));
        actualizarHorarios(mes);
        alert('Información del mes pegada.');
    } else {
        alert('No hay información copiada para pegar.');
    }
};

// Advertencia al intentar cerrar la página con cambios no guardados
window.addEventListener('beforeunload', (event) => {
    if (localStorage.getItem('clientes') !== JSON.stringify(clientes)) {
        const confirmationMessage = 'Hay cambios sin guardar. ¿Desea salir de todos modos?';
        event.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
        return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
});

// Función para cambiar la vista
const cambiarVista = (vista) => {
    const mes = document.getElementById('contenido').dataset.mes;
    if (!mes) return;

    const contenido = document.getElementById('contenido');
    if (vista === 'general') {
        mostrarVistaGeneral(mes);
    } else {
        mostrarFormularioNuevoCliente(mes, meses[mes - 1]);
    }
};

const mostrarVistaGeneral = (mes) => {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <h2>Vista General de ${meses[mes - 1]}</h2>
        <table>
            <thead>
                <tr>
                    <th>Nombre y Apellido</th>
                    <th>Días</th>
                    <th>Estado de Pago</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                ${clientes[mes].map(cliente => `
                    <tr>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.diasHorarios.length}</td>
                        <td>
                            <input type="checkbox" ${cliente.pago === 'pagado' ? 'checked' : ''} onclick="togglePago(this, '${mes}', '${cliente.nombre}')">
                        </td>
                        <td>
                            <button onclick="eliminarCliente('${mes}', '${cliente.nombre}')">Eliminar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
};

const togglePago = (checkbox, mes, nombre) => {
    const cliente = clientes[mes].find(c => c.nombre === nombre);
    cliente.pago = checkbox.checked ? 'pagado' : 'aPagar';
    localStorage.setItem('clientes', JSON.stringify(clientes));
    guardarDatos();
};

const eliminarCliente = (mes, nombre) => {
    clientes[mes] = clientes[mes].filter(c => c.nombre !== nombre);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    mostrarVistaGeneral(mes);
};

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', cargarMeses);
