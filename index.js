const {
  default: makeWASocket,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys');

const { status } = require('minecraft-server-util');const sock = makeWASocket({
  auth: state
});

if (!state.creds.registered) {
  const codigo = await sock.requestPairingCode('51960367134');
  console.log('Código de vinculación:', codigo);
}
