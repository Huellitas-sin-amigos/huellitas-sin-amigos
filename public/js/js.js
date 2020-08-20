
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCHtFhB42x3JsFDXtDUWhCERkVug1m4KOo",
    authDomain: "huellasprincipal.firebaseapp.com",
    databaseURL: "https://huellasprincipal.firebaseio.com",
    projectId: "huellasprincipal",
    storageBucket: "huellasprincipal.appspot.com",
    messagingSenderId: "721120925343",
    appId: "1:721120925343:web:cd6269d830ee9f15c374aa"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage();


var idus = document.getElementById('id');
var txtnombre = document.getElementById('nombre');
var txtedad = document.getElementById('edad');
var txtraza = document.getElementById('raza');
var txttamaño = document.getElementById('tamaño');
var txtsexo = document.getElementById('sexo');
var txtcaracter = document.getElementById('caracter');
var txtenfermedad = document.getElementById('enfermedad');
var ListadoAnimales = document.getElementById('ListadoAnimales');

var user = document.getElementById('user');
var pass = document.getElementById('pass');


var archivo = document.getElementById('archivo');
var imgArchivo = document.getElementById('imagenSubida');
function agregarDatos(datos) {
    db.collection("mascotas").add({
        nombre: txtnombre.value,
        Edad: txtedad.value,
        Raza: txtraza.value,
        Tamaño: txttamaño.value,
        Sexo: txtsexo.value,
        Caracter: txtcaracter.value,
        Enfermedad: txtenfermedad.value

    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            alert(' Datos agregados correctamente', docRef.id);
            limpiar();
            leerdatos();
        })
        .catch((error) => {
            console.error("Error: ", error);
        });


}
leerdatos();
function leerdatos() {
    ListadoAnimales.innerHTML = "";
    db.collection("mascotas").get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                ListadoAnimales.innerHTML += `    
                <tr>
				<td>${doc.data().nombre}</td>
				<td> ${doc.data().Edad}</td>
				<td>${doc.data().Raza} </td>
				<td>${doc.data().Tamaño}</td>
				<td>${doc.data().Sexo}</td>
                <td>${doc.data().Caracter}</td>
                <td>${doc.data().Enfermedad} </td>
                 <td><img src = '${doc.data().imagen}' id="imagenSubida"/> </td>
                <td>
                <button onclick="eliminar('${doc.id}')" class="danger"></i>Eliminar</button>
                <button id="caja"onclick="editar('${doc.id}')" class="info"></i>Editar</button>
                <button id="actualizar(${doc.id})" onclick="actualizar()" >Actualizar</button>
                
                </td>
			  </tr>            
            `;
            });
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });
}

function eliminar(id) {
    db.collection("mascotas").doc(id).delete()
        .then(() => {
            console.log("Documento ELIMINADO");
            leerdatos();
        }).catch((error) => {
            console.error("Error: ", error);
        });
}
function editar(id) {
    db.collection("mascotas").doc(id).get()
        .then((doc) => {
            idus.value = doc.id;
            txtnombre.value = doc.data().nombre;
            txtedad.value = doc.data().Edad;
            txtraza.value = doc.data().Raza;
            txttamaño.value = doc.data().Tamaño;
            txtsexo.value = doc.data().Sexo;
            txtcaracter.value = doc.data().Caracter;
            txtenfermedad.value = doc.data().Enfermedad;

        })
        .catch((error) => {
            console.error("Error: ", error);
        });

}

function actualizar(id) {
    db.collection("mascotas").doc(idus.value).update({
        nombre: txtnombre.value,
        Edad: txtedad.value,
        Raza: txtraza.value,
        Tamaño: txttamaño.value,
        Sexo: txtsexo.value,
        Caracter: txtcaracter.value,
        Enfermedad: txtenfermedad.value
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
}

function limpiar() {
    txtnombre.value = "";
    txtedad.value = "";
    txtraza.value = "";
    txttamaño.value = "";
    txtsexo.value = "";
    txtcaracter.value = "";
    txtenfermedad.value = "";
}

function login() {
    firebase.auth().signInWithEmailAndPassword(user.value, pass.value)
        .then(() => {
            window.location.href = 'registro.html'
        })
        .catch(function (error) {
            alert('Datos incorrectos');
            user.value = "";
            pass.value = "";
        });
}

function cerrarSesion() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = "login.html";
        }).catch((error) => {
            console.log(error.message)
        });
}

archivo.addEventListener('change', (e) => {
    var nombre = e.target.files[0].name;
    var tmp = URL.createObjectURL(e.target.files[0]);
    console.log("Evento: ", tmp);
    imgArchivo.src = tmp;
})

function subirImagen(){
    var archivoFile = archivo.files[0];
    var nombre = archivo.files[0].name; 
    var uploadTask = storage.ref('imagenes/' + nombre).put(archivoFile) 
    .then((img) => {
        console.log('Imagen cargada ', img.totalBytes)
        console.log(archivo.files[0].type);
    });

    storage.ref('imagenes/' + archivoFile.name).getDownloadURL()
    .then((urlImg) => {
        imgArchivo.src = urlImg;
        
        db.collection("mascotas").doc('GxmZlICrAiaLVA1JTwt9').update({
            imagen: urlImg
        })
            .then( ()=> {
                console.log("Document successfully updated!");
            })
            .catch((error)=> {
                console.error("Error: ", error);
            });

    });
}