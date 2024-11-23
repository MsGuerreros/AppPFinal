const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    abrirSimilitud: () => ipcRenderer.send('abrir-similitud'),
    abrirTexto: (providencia) => ipcRenderer.send('abrir-texto', providencia)
});
