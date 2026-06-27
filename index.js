const {
  default: makeWASocket,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys');

const { status } = require('minecraft-server-util');

const SERVER_IP = 'Territorio_LOL.aternos.me';
const SERVER_PORT = 22502;

let GROUP_ID = 'Minecraft para la racha';
let estadoAnterior = null;

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection }) => {
    if (connection === 'open') {
      console.log('✅ WhatsApp conectado');

      if (!state.creds.registered) {
        try {
          const codigo = await sock.requestPairingCode('51960367134');
          console.log('Código de vinculación:', codigo);
        } catch (err) {
          console.error('Error al generar el código:', err);
        }
      }
    }
  });

  setInterval(async () => {
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
