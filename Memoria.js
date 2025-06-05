export class Segmento {
  constructor(nombre, tamaño) {
    this.nombre = nombre;
    this.tamaño = tamaño;
    this.inicio = null;
  }
}

export class Memoria {
  constructor(tamaño) {
    this.tamaño = tamaño;
    this.segmentos = [];
    this.colaFIFO = []; // Para reemplazo
  }

  obtenerHuecosLibres() {
    const huecos = [];
    if (this.segmentos.length === 0) {
      huecos.push({ inicio: 0, tamaño: this.tamaño });
      return huecos;
    }

    this.segmentos.sort((a, b) => a.inicio - b.inicio);

    if (this.segmentos[0].inicio > 0) {
      huecos.push({ inicio: 0, tamaño: this.segmentos[0].inicio });
    }

    for (let i = 0; i < this.segmentos.length - 1; i++) {
      const finActual = this.segmentos[i].inicio + this.segmentos[i].tamaño;
      const inicioSiguiente = this.segmentos[i + 1].inicio;
      if (inicioSiguiente > finActual) {
        huecos.push({ inicio: finActual, tamaño: inicioSiguiente - finActual });
      }
    }

    const ultimoFin = this.segmentos.at(-1).inicio + this.segmentos.at(-1).tamaño;
    if (ultimoFin < this.tamaño) {
      huecos.push({ inicio: ultimoFin, tamaño: this.tamaño - ultimoFin });
    }

    return huecos;
  }

  compactarHuecos() {
    // Fusiona huecos libres adyacentes (solo si se eliminan segmentos en el medio)
    this.segmentos.sort((a, b) => a.inicio - b.inicio);
  }

  asignarSegmento(nombre, tamaño) {
    const nuevoSegmento = new Segmento(nombre, tamaño);

    while (true) {
      const huecos = this.obtenerHuecosLibres();
      const mejorHueco = huecos.filter(h => h.tamaño >= tamaño)
                                .sort((a, b) => a.tamaño - b.tamaño)[0];

      if (mejorHueco) {
        nuevoSegmento.inicio = mejorHueco.inicio;
        this.segmentos.push(nuevoSegmento);
        this.colaFIFO.push(nuevoSegmento);
        console.log(`Asignado '${nombre}' en ${nuevoSegmento.inicio} (${tamaño} KB)`);
        break;
      } else if (this.colaFIFO.length > 0) {
        const eliminado = this.colaFIFO.shift();
        this.segmentos = this.segmentos.filter(s => s !== eliminado);
        console.log(`Reemplazado '${eliminado.nombre}' por falta de espacio`);
        this.compactarHuecos();
      } else {
        console.log(`No se puede asignar '${nombre}', sin espacio suficiente.`);
        break;
      }
    }
  }

  mostrarEstado() {
    console.log("\nEstado de la memoria:");
    this.segmentos.sort((a, b) => a.inicio - b.inicio);
    this.segmentos.forEach(s => {
      console.log(`- ${s.nombre}: Inicio=${s.inicio}, Tamaño=${s.tamaño}`);
    });
    console.log("\nHuecos libres:", this.obtenerHuecosLibres());
  }
}