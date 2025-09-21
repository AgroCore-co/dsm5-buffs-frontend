// Teste simples de POST para criação de búfalo

async function testCreateBuffalo() {
  const url = 'http://localhost:3001/bufalos';
  const payload = {
    nome: 'VINI',
    brinco: 'VN-2025',
    microchip: '982030666223344',
    dt_nascimento: '2023-11-10T00:00:00.000Z',
    nivel_maturidade: 'B',
    sexo: 'M',
    id_raca: 1,
    id_propriedade: 1,
    status: true
  };

  // Coloque seu token JWT abaixo
  const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjE3azBFTFRGeFdLSm8vRlciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Nudm5yaGViZHNyZ29rbnNtcm5wLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyYzA5YWI3Ny05ZWY3LTRhMGUtOTE3My04MWMxMTJjNDZhOGYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4NDIyNDYxLCJpYXQiOjE3NTg0MTg4NjEsImVtYWlsIjoidmluaUBidWZmcy5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoidmluaUBidWZmcy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibm9tZSI6IlZpbmljaXVzIFNvdXphIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIyYzA5YWI3Ny05ZWY3LTRhMGUtOTE3My04MWMxMTJjNDZhOGYiLCJ0ZWxlZm9uZSI6IjEzOTk3MjU0Njc2In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTgzOTA3MTN9XSwic2Vzc2lvbl9pZCI6IjliMDVhMzg4LTUxYzktNGY3MS1iNTI1LWNlZjZmOWZiOTM0YiIsImlzX2Fub255bW91cyI6ZmFsc2V9.hxjuPz93sBz9zHx60W-9GTTYTgxotyZ0th4UH_AubjY'; // Exemplo: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
  } catch (err) {
    console.error('Erro ao criar búfalo:', err);
  }
}

testCreateBuffalo();
