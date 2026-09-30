const https = require('https');
https.get('https://fonts.google.com/metadata/fonts', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    const fonts = json.familyMetadataList.map(f => f.family);
    console.log('Amst:', fonts.filter(f => f.toLowerCase().includes('amst')));
  });
});
