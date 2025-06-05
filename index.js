import { Memoria, Segmento } from './Memoria.js';

const memoria = new Memoria(100);

// Asignamos segmentos de forma que no se llene completamente la memoria
memoria.asignarSegmento("A", 20);  // 0 - 20
memoria.asignarSegmento("B", 30);  // 20 - 50
memoria.asignarSegmento("C", 20);  // 50 - 70

// Se deja espacio libre al final (100 KB - 70 KB = 30 KB libres)

memoria.mostrarEstado();

// Ahora intentamos asignar uno más grande que los huecos internos (pero menor que la suma total)
// Esto activará el reemplazo FIFO y dejará espacio al final
memoria.asignarSegmento("D", 40);  // Requiere liberar al menos 40 KB

memoria.mostrarEstado();