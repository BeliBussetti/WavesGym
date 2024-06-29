let clientes = {};

const cargarClientes = () => {
    const tbody = document.querySelector('#tablaClientes tbody');
    tbody.innerHTML = '';
    
    Object.keys(clientes).forEach(mes => {
        clientes[mes].forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${mes}</td>
                <td>${cliente.diasHorarios.map(dh => `${dh.dia} ${dh.horario}`).join(', ')}</td>
                <td>
                    <input type="checkbox" ${cliente.pago === 'pagado' ? 'checked' : ''} onclick="togglePago(this, '${mes}', '${cliente.nombre}')">
                </td>
            `;
            tbody.appendChild(row);
        });
    });
};

const togglePago = (checkbox, mes, nombre) => {
    const cliente = clientes[mes].find(c => c.nombre === nombre);
    cliente.pago = checkbox.checked ? 'pagado' : 'aPagar';
    guardarEnLocalStorage();
};

const cargarDesdeLocalStorage = () => {
    const data = localStorage.getItem('clientes');
    if (data) {
        clientes = JSON.parse(data);
        cargarClientes();
    }
};

const cargarDesdeJSON = () => {
    fetch('data/clientes.json')
        .then(response => response.json())
        .then(data => {
            clientes = data;
            cargarClientes();
        });
};

const guardarEnLocalStorage = () => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
};

const guardarDatos = () => {
    const blob = new Blob([JSON.stringify(clientes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.json';
    a.click();
};

window.addEventListener('beforeunload', (e) => {
    if (localStorage.getItem('clientes') !== JSON.stringify(clientes)) {
        const confirmationMessage = 'Hay cambios sin guardar. ¿Desea salir de todos modos?';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    cargarDesdeLocalStorage();
    cargarDesdeJSON();
});
