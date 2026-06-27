const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const { status } = require('minecraft-server-util');

const SERVER_IP = 'Territorio_LOL.aternos.me';
const SERVER_PORT = 22502;

// Déjalo vacío por ahora
let GROUP_ID = '';

let estadoAnterior = null;

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('✅ WhatsApp conectado');
    }
  });

  setInterval(async () => {
    // No enviar nada hasta tener el ID del grupo
    if (!GROUP_ID) return;

    try {
      await status(SERVER_IP, SERVER_PORT);

      if (estadoAnterior !== 'ON') {
        await sock.sendMessage(GROUP_ID, {
          text: '🟢 El servidor Territorio_LOL está ENCENDIDO.'
        });
        estadoAnterior = 'ON';
      }
    } catch {
      if (estadoAnterior !== 'OFF') {
        await sock.sendMessage(GROUP_ID, {
          text: '🔴 El servidor Territorio_LOL está APAGADO.'
        });
        estadoAnterior = 'OFF';
      }
    }
  }, 60000);
}

iniciarBot();
