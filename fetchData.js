const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const dbPath = path.join(__dirname, 'db', 'db.json');

fetch('https://pixabay.com/api/?key=36404956-dbea71482a1b61f69c95cb03c&q=cuisines+dinner&per_page=20')
  .then((response) => response.json())
  .then((data) => {
    if (data.hits) {
      fs.readFile(dbPath, 'utf8', (err, fileData) => {
        if (err) {
          console.error('Error reading db.json:', err);
          return;
        }

        const jsonData = JSON.parse(fileData);

        const extractedData = data.hits.map((hit) => ({
          id: hit.id,
          imageUrl: hit.webformatURL,
          title: hit.tags,
          description: '',
        }));
        jsonData.cuisines = extractedData;

        const updatedJsonData = JSON.stringify(jsonData, null, 2);
        fs.writeFile(dbPath, updatedJsonData, 'utf8', (err) => {
          if (err) {
            console.error('Error writing to db.json:', err);
          } else {
            console.log('Data successfully incorporated into db.json');
          }
        });
      });
    } else {
      console.log('No results found from Pixabay API');
    }
  })
  .catch((error) => {
    console.error('Error fetching data from Pixabay API:', error);
  });
