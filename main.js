const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Función para crear la ventana principal
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

// Evento para abrir la ventana de texto
ipcMain.on('abrir-texto', (event, providencia) => {
    const textoWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'textoRenderer.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    textoWindow.loadFile('texto.html');
});

// Evento para abrir la ventana de similitudes
ipcMain.on('abrir-similitud', () => {
    const similitudWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'similitudRenderer.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    similitudWindow.loadFile('similitud.html');
});

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});
