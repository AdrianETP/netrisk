# NetRisk - Herramienta de Análisis de Riesgos Cibernéticos

  

## Descripción del Proyecto

  

NetRisk es una herramienta automatizada para la identificación y análisis de riesgos cibernéticos, diseñada específicamente para redes de instituciones educativas. Utiliza contenedores Docker, técnicas de pentesting y herramientas de análisis de red para ofrecer un enfoque integral en la evaluación de vulnerabilidades y recomendaciones de seguridad.

  

---

  

## Requisitos Previos

  

Asegúrate de tener instalados los siguientes componentes:

  

- **Docker** (versión 27.2.0 o superior)

- **Docker Compose** (versión 2.29.2-desktop.2 o superior)

- **Node.js** (versión 18.0.0 o superior)

- **Python** (versión 3.12 o superior)

- **MongoDB** (versión 8.0 o superior)

  

---

  

## Instalación

### Clona el repositorio del proyecto

    git clone https://github.com/AdrianETP/netrisk.git
    cd netrisk

### Ingresa a la carpeta backend_data
Corre los siguientes comandos:

    cd ./backend_data
    python3 -m venv venv

### Ingresa a la carpeta frontend_data

Corre los siguientes comandos:

    cd ./frontend_data
    npm install

## Configuración

1. Crea un archivo **firebase.js** adentro de netrisk/frontend_data/src con lo siguiente:
    

	    import { initializeApp } from  "firebase/app";
        import { getAuth, setPersistence, browserSessionPersistence } from  "firebase/auth";
        import { getFirestore } from  'firebase/firestore';
        
        const  firebaseConfig = {
        apiKey:  "API_KEY",
        authDomain:  "AUTH_DOMAIN",
        projectId:  "PROYECT_ID",
        storageBucket:  "STORAGE_BUCKET,
        messagingSenderId:  "SENDER_ID",
        appId:  "APP_ID",
        measurementId:  "MEASUREMENT_ID",
        };
        
        const  app = initializeApp(firebaseConfig);
        const  auth = getAuth(app);
        setPersistence(auth, browserSessionPersistence)
        .then(() => {
        })
        .catch((error) => {
        console.error("Error setting persistence:", error);
        }); 
        const  db = getFirestore(app); 
        export { auth, db };

2. Reemplaza los valores con las credenciales apropiadas para tu entorno.

## Ejecución

1. Para iniciar la aplicación, ejecuta:

		cd ./netrisk
		docker-compose up

2. Accede a la aplicación en tu navegador en http://localhost:3000.
