// NO ME FUE SUFICIENTE CON EL VIDEO PROPORCIONADO LE PEDI A LA IA QUE ME AYUDE A HACERLOS UNO A UNO
// ENTENDIENDO SU UTILIDAD Y FUNCIONAMIENTO DE CADA UNO.


// hola mundo

alert("Hola mundo");
console.log("Hola mundo");


// pedir nombre

var nombre = prompt("Cual es tu nombre?");

alert("Hola " + nombre);
console.log("Hola " + nombre);


// suma de 2 numeros

var num1 = parseFloat(prompt("Primer número"));
var num2 = parseFloat(prompt("Segundo número"));

var suma = num1 + num2;

alert("La suma es " + suma);
console.log(suma);


// mayor o menor de edad

var edad = parseInt(prompt("Cual es tu edad?"));

if(edad >= 18){

    alert("Es mayor");
    console.log("Es mayor");

}else{

    alert("Es menor");
    console.log("Es menor");
}


// par o impar

var numero = parseInt(prompt("Ingresa un numero"));

if(numero % 2 == 0){

    alert("Es par");
    console.log("Es par");

}else{

    alert("Es impar");
    console.log("Es impar");
}


// numero mayor entre 3

var n1 = parseFloat(prompt("Numero 1"));
var n2 = parseFloat(prompt("Numero 2"));
var n3 = parseFloat(prompt("Numero 3"));

var mayor = n1;

if(n2 > mayor){
    mayor = n2;
}

if(n3 > mayor){
    mayor = n3;
}

alert("El mayor es " + mayor);
console.log(mayor);


// notas

var nota = parseFloat(prompt("Ingresa una nota"));

if(nota >= 8 && nota <= 10){

    alert("Muy bien");
    console.log("Muy bien");

}else if(nota >= 5){

    alert("Aceptable");
    console.log("Aceptable");

}else if(nota >= 1){

    alert("Insuficiente");
    console.log("Insuficiente");

}else{

    alert("Nota invalida");
    console.log("Nota invalida");
}


// contador 1 al 10

for(let i = 1; i <= 10; i++){

    console.log(i);
}


// pares del 1 al 20

for(let i = 1; i <= 20; i++){

    if(i % 2 == 0){

        console.log(i);
    }
}


// contraseña

let pass = prompt("Ingresa la contraseña");

if(pass === "1234"){

    alert("Correcta");
    console.log("Correcta");

}else{

    alert("Incorrecta");
    console.log("Incorrecta");
}


// sumar numeros hasta 0

let total = 0;
let num;

do{

    num = Number(prompt("Numero (0 para salir)"));

    total += num;

}while(num !== 0);

alert("Total: " + total);
console.log(total);


// calculadora

let a = Number(prompt("Primer numero"));
let b = Number(prompt("Segundo numero"));

let op = prompt("suma, resta, multi o div");

if(op === "suma"){

    console.log(a + b);
    alert(a + b);

}else if(op === "resta"){

    console.log(a - b);
    alert(a - b);

}else if(op === "multi"){

    console.log(a * b);
    alert(a * b);

}else if(op === "div"){

    console.log(a / b);
    alert(a / b);

}else{

    console.log("Operacion invalida");
}


// mini menu

let opcion = Number(prompt(
    "1 saludo 2 fecha 3 random"
));

if(opcion === 1){

    alert("Hola");
    console.log("Hola");

}else if(opcion === 2){

    alert(new Date());
    console.log(new Date());

}else if(opcion === 3){

    alert(Math.random());
    console.log(Math.random());

}else{

    alert("Opcion invalida");
}


// adivinar numero

let secreto = Math.floor(Math.random() * 10) + 1;

let intento = Number(prompt("Adivina del 1 al 10"));

if(intento === secreto){

    alert("Adivinaste el numero!");
    console.log("Adivinaste el numero!");

}else{

    alert("Le erraste, intenta de nuevo");
    console.log("Le erraste");
}


// contar pares

let pares = 0;
let numeroPar;

do{

    numeroPar = Number(prompt("Numero"));

    if(numeroPar % 2 == 0 && numeroPar !== 0){

        pares++;
    }

}while(numeroPar !== 0);

alert("Pares: " + pares);
console.log(pares);


// array nombres

let nombres = ["Juan", "Ana", "Pedro", "Luis", "Maria"];

console.log(nombres);


// recorrer array

let frutas = ["Manzana", "Banana", "Pera"];

for(let i = 0; i < frutas.length; i++){

    console.log(frutas[i]);
}


// mayor y menor de array

let numeros = [5, 8, 2, 20, 1];

let Mayor = numeros[0];
let Menor = numeros[0];

for(let i = 0; i < numeros.length; i++){

    if(numeros[i] > Mayor){

        Mayor = numeros[i];
    }

    if(numeros[i] < Menor){

        Menor = numeros[i];
    }
}

console.log("El número Mayor es:", Mayor);
console.log("El número Menor es:", Menor);


// promedio notas

let notas = [1,2,3,4,5,6,7,8,9,10];

let sumanotas = 0;

for(let i = 0; i < notas.length; i++){

    sumanotas += notas[i];
}

let promedio = sumanotas / notas.length;

console.log(promedio);


// guardar nombres

let names = [];
let nom;

do{

    nom = prompt("Ingresa un nombre o 'salir' para terminar");

    if(nom !== "salir"){

        names.push(nom);
    }

}while(nom !== "salir");

console.log(names);


// cantidad elementos

let colores = ["Rojo", "Azul", "Verde"];

console.log(colores.length);


// mostrar pares array

let nums = [1,2,3,4,5,6,7,8];

for(let i = 0; i < nums.length; i++){

    if(nums[i] % 2 == 0){

        console.log(nums[i]);
    }
}


// includes

let frutas1 = ["Manzana", "Banana", "Pera"];

if(frutas1.includes("Banana")){

    console.log("Existe");

}else{

    console.log("No existe");
}


// pop

let frutas2 = ["Manzana", "Banana", "Pera"];

frutas2.pop();

console.log(frutas2);


// push

let frutas3 = ["Manzana", "Banana"];

frutas3.push("Pera");

console.log(frutas3);
