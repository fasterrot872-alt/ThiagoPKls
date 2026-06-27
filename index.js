const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { status } = require('minecraft-server-util');

const SERVER_IP = 'Territorio_LOL.aternos.me';
const SERVER_PORT = 22502;

const GROUP_ID = 'AQUI_EL_ID_DEL_GRUPO';

let estadoAnterior = null;

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  setInterval(async () => {
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
