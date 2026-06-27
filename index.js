const sock = makeWASocket({
  auth: state
});

if (!state.creds.registered) {
  const codigo = await sock.requestPairingCode('51960367134');
  console.log('Código de vinculación:', codigo);
}
