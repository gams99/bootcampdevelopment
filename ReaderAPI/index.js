import {promises as fs} from "fs";
let state = null;

init();

async function init(){
filterStates();
getSizeCitiesByStates('more');
await getSizeCitiesByStates('less');
await getSizeCities(true);
getSizeCities(false);
}

async function filterStates(){
  const jsonStates = JSON.parse(await fs.readFile("Estados.json"));
  const jsonCities = JSON.parse(await fs.readFile("Cidades.json"));
  
  for (state of jsonStates){
    const stateCities = jsonCities.filter((city => city.Estado === state.ID));
    fs.writeFile(`./states/${state.Sigla}.json`, JSON.stringify(stateCities));
  }
}

async function getCitiesCount(uf){
  const citiesByState = JSON.parse(await fs.readFile(`./states/${uf}.json`));
  //let total = citiesByState.length 
  //console.log(total);
  return citiesByState.length;
  
}

async function getSizeCitiesByStates(condition){
  const jsonStates = JSON.parse(await fs.readFile("Estados.json"));
  const list = [];

  for(state of jsonStates) {
    const count = await getCitiesCount(state.Sigla);
    list.push({UF: state.Sigla, count});
  }
  
  list.sort((a,b) => {
    if (a.count < b.count) {return 1};
    if (a.count > b.count) {return -1}
  });
  
  if(condition === 'more'){
    let results = list.slice(0,5);
    console.log(results);
  } else if(condition == 'less') {
    let results = list.slice(-5);
    console.log(results);
  }
}

async function getSizeCities(bigger){
  const jsonStates = JSON.parse(await fs.readFile("Estados.json"));
  const result = [];
  console.log('hi');

  for(state of jsonStates){
    let city;

    if(bigger){
    city = await getBiggerCityName(state.Sigla);
    } else {
    city = await getSmallerCityName(state.Sigla);
    }

    result.push(city.Nome + ' - ' + state.Sigla);
  }
  console.log(result);
}

async function getBiggerCityName(uf){
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) result = city;
    else if (city.Nome.length > result.Nome.length) result = city;
    else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase()
    )
      result = city;
  });
  return result;
  
}

async function getSmallerCityName(uf){
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) result = city;
    else if (city.Nome.length < result.Nome.length) result = city;
    else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase()
    )
      result = city;
  });
  return result;
  
}

