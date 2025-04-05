const nuevoRegistro = document.getElementById("nuevoRegistro")
const operacionTipo = document.getElementById("operacionTipo");
const subOperacionTipo = document.getElementById("subOperacionTipo");
const cuotas = document.getElementById("cuotas");
const monto = document.getElementById("monto");
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
const listaMovimientos = document.getElementById("listaMovimientos");


mostrarMovimientos();

operacionTipo.addEventListener("change", () =>{
    const tipoSeleccionado = operacionTipo.value;
    if (tipoSeleccionado === "ingreso"){
        subOperacionTipo.innerHTML = `
        <label for="subtipo">Categoría de ingreso:</label>
        <select id="subtipo">
          <option value="sueldo">Sueldo</option>
          <option value="venta">Venta</option>
          <option value="otros">Otros</option>
        </select>
      `;
    }
    else if (tipoSeleccionado === "gasto"){
        subOperacionTipo.innerHTML = `
        <label for="subtipo">Categoría de gasto:</label>
        <select id="subtipo">
          <option value="alquiler">Alquiler</option>
          <option value="comida">Comida</option>
          <option value="servicios">Servicios</option>
          <option value="tarjeta de credito">Tarjeta de Credito</option>
        </select>
      `;
    }
    else {
        subOperacionTipo.innerHTML = "";
    }
});

subOperacionTipo.addEventListener("change", () =>{
    const subtipo = document.getElementById("subtipo");
    if (subtipo.value === "tarjeta de credito"){
        cuotas.innerHTML =`
            <input id="inputCuotas" type="number" placeholder="Cuotas" min="1" value="1">
        `;
    }
    else{
        cuotas.innerHTML = "";
    }
})

nuevoRegistro.addEventListener("submit",(event)=>{
    event.preventDefault()
    const subtipo = document.getElementById("subtipo");
    const fijo = document.getElementById("fijo").value === "si";
    const inputCuotas = document.getElementById("inputCuotas");
    const cantidadCuotas = inputCuotas ? parseInt(inputCuotas.value) : 1;
    const registro = {
        id:Date.now(),
        fecha: new Date(),
        tipo: operacionTipo.value,
        descripcion: subtipo.value,
        fijo: fijo,
        monto: parseFloat(monto.value),
        cuotas:cantidadCuotas
    }
    movimientos.push(registro);
    localStorage.setItem("movimientos", JSON.stringify(movimientos)); 
    mostrarMovimientos();
    nuevoRegistro.reset();
    cuotas.innerHTML = "";
    subOperacionTipo.innerHTML = "";
})

function eliminarMovimiento(id) {
    movimientos = movimientos.filter(mov => mov.id !== id);
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
    mostrarMovimientos();
}

function mostrarMovimientos(){
    listaMovimientos.innerHTML="";
    const datosGuardados = JSON.parse(localStorage.getItem("movimientos")) || [];
    const fechaHoy = new Date()
    datosGuardados.forEach((dato) => {
        const fechaMovimiento = new Date(dato.fecha)
        const diferenciaMeses =
            (fechaHoy.getFullYear() - fechaMovimiento.getFullYear())*12 
            +
            (fechaHoy.getMonth() - fechaMovimiento.getMonth()
        );
        if (dato.cuotas > 1 && diferenciaMeses >= dato.cuotas){
            return;
        }
        const cuotaActual = dato.cuotas > 1 ? ` - Cuota ${diferenciaMeses + 1}/${dato.cuotas}` : "";
        const li = document.createElement("li");
        li.textContent =`${fechaMovimiento.toLocaleDateString("es-AR")} - ${dato.descripcion} - ${dato.monto} ${cuotaActual}`;
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.setAttribute("data-id", dato.id);
        btnEliminar.addEventListener("click", () => eliminarMovimiento(dato.id));
        li.appendChild(btnEliminar);
        listaMovimientos.appendChild(li);
    });
}

