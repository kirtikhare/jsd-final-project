
const searchForm = document.querySelector( '#searchForm' );
const searchItem = document.querySelector( '#search' );
const containerDiv = document.querySelector( '#container' );
const results = document.querySelector( '#results');
const detailsDiv = document.querySelector('#details');
const randomDiv = document.querySelector( '#random' );

let intervalId = 0;
let intervalIdSearch = 0;
let searched = 0;

const randomURL = `https://www.themealdb.com/api/json/v1/1/random.php`;

function loadSlide(){
    axios.get(randomURL)
    .then( function( response ) {
        console.log(response.data);
        var meal = response.data;
        
        containerDiv.innerHTML = `
      <div id="content-container">
        <div class="tags">
          <button onclick="loadArea()" areaid="${meal.meals[0].strArea}" class="tagButton" id="areaButton"> ${meal.meals[0].strArea} </button>
          <button onclick="loadCat()" catid="${meal.meals[0].strCategory}" class="tagButton" id="catButton"> ${meal.meals[0].strCategory} </button>
        </div>
        <h1 id="${meal.meals[0].idMeal}">${meal.meals[0].strMeal}</h1>
        <img src=${meal.meals[0].strMealThumb} alt="Meal Thumbnail">
        <div id=instruct>
          <p>${meal.meals[0].strInstructions}</p>
        </div>
      </div>
      <div class="checkout">
        <button onclick=loadRecipe() recid="${meal.meals[0].idMeal}" id="recipeButton"> more >> </button>
      </div>
        `
    })
    .catch( function( err ){
        console.log('Error loading random recepie', err );
    });
}

function loadRecipe(){
  let mealId=document.querySelector( '#recipeButton' ).getAttribute( 'recid' );
  
  searched = 1;

  randomDiv.innerHTML = '';
  randomDiv.classList.add('hidden');
  clearInterval(intervalIdSearch);

  const detailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
      
          axios.get(detailsUrl)
            .then(response => {
              const data = response.data;
              // Format and display article details in the details div
              let ingredients = [];
              let count = 1;

              for (let i in data.meals[0]) {
                let ingredient = "";
                let measure = "";
                if (i.startsWith("strIngredient") && data.meals[0][i]) {
                  ingredient = data.meals[0][i];
                  measure = data.meals[0][`strMeasure` + count];
                  count += 1;
                  ingredients.push(`${measure} ${ingredient}`);
                }
              }

              detailsDiv.innerHTML = `
              <div class="recipe">
              <img src="${data.meals[0].strMealThumb}" alt="Selected Recepie" width="200" height="200">
              <div class="title"><h1> ${data.meals[0].strMeal} </h1></div>
              <div class="recipe-body">
                <h1 id="IngList"> Ingredients </h1>
                <div id="ingred-list" style="display: flex;">
                  <div id="ingred-cont">
                  </div>
                </div>
                <div class="instruct">
                  <h1> Intructions </h1>
                  <p>${data.meals[0].strInstructions}</p>
                  <p> Source: ${data.meals[0].strSource} <p>
                </div>
              </div>
              </div>
                `;

                let ingCon = document.getElementById("ingred-cont");
                let parent = document.createElement("ul");

                ingredients.forEach( (i) => {
                  let child = document.createElement("li");
                  child.innerText = i;
                  parent.appendChild(child);
                  ingCon.appendChild(parent);
                })
      
              // Show the detailsDiv and hide the resultsDiv
              detailsDiv.classList.remove('hidden');
              results.classList.add('hidden');
            })
            .catch(err => {
              console.log('Error loading article details', err);
              // Handle errors, maybe display a message to the user
            });
}

function loadHome(){
  window.location.reload();
}

function loadArea(){
  let areaId=document.querySelector( '#areaButton' ).getAttribute( 'areaid' );

  
  searched = 1;

  randomDiv.innerHTML = '';
  randomDiv.classList.add('hidden');
  clearInterval(intervalIdSearch);
  
  results.classList.remove('hidden');
  results.innerHTML = '';
  detailsDiv.classList.add('hidden');

  const detailsUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaId}`;
      
          axios.get(detailsUrl)
            .then(response => {
              const data = response.data;
              // Format and display article details in the details div
              for( const meal of response.data.meals){
        
                console.log( meal.mealId );
        
                results.innerHTML += `
                <div class="meal" id="${meal.idMeal}">
                  <img src=${meal.strMealThumb} alt="${meal.strMeal} Thumbnail" width="100" height="100" id="${meal.idMeal}">
                  <div id="${meal.idMeal}">
                    <h3 id="${meal.idMeal}">${meal.strMeal}</h1>
                  </div>
                </div>
                `;
              }
              // each article
        
            }) // .then()
            .catch( function( err ){
            
              console.log( `Error loading search results`, err );
        
              results.innerHTML = 'There was an error performing the search. Please try again.';
        
            });
}

function loadCat(){
  let catId=document.querySelector( '#catButton' ).getAttribute( 'catid' );
  
  searched = 1;

  randomDiv.innerHTML = '';
  randomDiv.classList.add('hidden');
  clearInterval(intervalIdSearch);
  
  results.classList.remove('hidden');
  results.innerHTML = '';
  detailsDiv.classList.add('hidden');

  const detailsUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${catId}`;
      
          axios.get(detailsUrl)
            .then(response => {
              const data = response.data;
              // Format and display article details in the details div
              for( const meal of response.data.meals){
        
                console.log( meal.mealId );
        
                results.innerHTML += `
                <div class="meal" id="${meal.idMeal}">
                  <img src=${meal.strMealThumb} alt="${meal.strMeal} Thumbnail" width="100" height="100" id="${meal.idMeal}">
                  <div id="${meal.idMeal}">
                    <h3 id="${meal.idMeal}">${meal.strMeal}</h1>
                  </div>
                </div>
                `;
              }
              // each article
        
            }) // .then()
            .catch( function( err ){
            
              console.log( `Error loading search results`, err );
        
              results.innerHTML = 'There was an error performing the search. Please try again.';
        
            });
}

//different search functions

function switchToName(){
  document.querySelector( '#searchTypeName' ).setAttribute( 'activated',"true" );
  document.querySelector( '#searchTypeArea' ).setAttribute( 'activated',"false" );
  document.querySelector( '#searchTypeCat' ).setAttribute( 'activated',"false" );

  const arealistDiv = document.querySelector( '#areaList' );
  arealistDiv.classList.add( 'hidden' );
  
  const catlistDiv = document.querySelector( '#catList' );
  catlistDiv.classList.add( 'hidden' );

  loadHome();
}

function switchToArea(){
  document.querySelector( '#searchTypeArea' ).setAttribute( 'activated',"true" );
  document.querySelector( '#searchTypeName' ).setAttribute( 'activated',"false" );
  document.querySelector( '#searchTypeCat' ).setAttribute( 'activated',"false" );

  searchForm.classList.add( 'hidden' );

  randomDiv.innerHTML = '';
  randomDiv.classList.add( 'hidden' );
  clearInterval(intervalIdSearch);

  results.classList.add( 'hidden' );
  results.innerHTML = '';
  
  detailsDiv.classList.add( 'hidden' );

  const catDiv = document.querySelector( '#catList' );
  catDiv.classList.add( 'hidden' );

  const areaDiv = document.querySelector( '#areaList' );
  areaDiv.classList.remove( 'hidden' );
  
  const areaUrl = `https://www.themealdb.com/api/json/v1/1/list.php?a=list`;

  axios.get(areaUrl)
      .then( function( response ){
  
        for( const area of response.data.meals){
          let child = document.createElement("button");
          child.innerText = area.strArea;
          child.classList.add( "tagButton" );

          child.addEventListener( "click", function() {
        
            areaDiv.classList.add( 'hidden' )
            areaDiv.innerHTML = '';

            results.classList.remove('hidden');
            results.innerHTML = '';
            
            const detailsUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area.strArea}`;
            
            axios.get(detailsUrl)
              .then(response => {
                // Format and display article details in the details div
                for( const meal of response.data.meals){
          
                  console.log( meal.mealId );
          
                  results.innerHTML += `
                  <div class="meal" id="${meal.idMeal}">
                    <img src=${meal.strMealThumb} alt="${meal.strMeal} Thumbnail" width="100" height="100" id="${meal.idMeal}">
                    <div id="${meal.idMeal}">
                      <h3 id="${meal.idMeal}">${meal.strMeal}</h1>
                    </div>
                  </div>
                  `;
                }
                // each article
          
              }) // .then()
              .catch( function( err ){
              
                console.log( `Error loading search results`, err );
          
                results.innerHTML = 'There was an error performing the search. Please try again.';
          
              });

          })

          areaDiv.appendChild(child);
        }
      })
}

function switchToCat(){
  document.querySelector( '#searchTypeCat' ).setAttribute( 'activated',"true" );
  document.querySelector( '#searchTypeName' ).setAttribute( 'activated',"false" );
  document.querySelector( '#searchTypeArea' ).setAttribute( 'activated',"false" );

  searchForm.classList.add( 'hidden' );

  randomDiv.innerHTML = '';
  randomDiv.classList.add( 'hidden' );
  clearInterval(intervalIdSearch);

  results.classList.add( 'hidden' );
  results.innerHTML = '';
  
  detailsDiv.classList.add( 'hidden' );

  const areaDiv = document.querySelector( '#areaList' );
  areaDiv.classList.add( 'hidden' );
  areaDiv.innerHTML = ''

  const catDiv = document.querySelector( '#catList' );
  catDiv.classList.remove( 'hidden' );

  const catUrl = `https://www.themealdb.com/api/json/v1/1/categories.php`;

  axios.get(catUrl)
      .then( function( response ){
  
        for( const cat of response.data.categories){
          let child = document.createElement("div");
          let image = document.createElement("img");
          let title = document.createElement("h2");
          let description = document.createElement("p");

          image.setAttribute( "src",cat.strCategoryThumb );
          image.setAttribute( "style","float: left;")
          image.setAttribute( "width","100px")
          image.setAttribute( "height","100px")
          image.setAttribute( "margin","0")

          title.innerText = cat.strCategory;
          description.innerText = cat.strCategoryDescription;

          child.setAttribute( "class","meal" );
          child.setAttribute( "style","display: flex; width: 500px; height: max-content;flex-direction: column; align-items: flex-start;");

          child.appendChild(title);
          child.appendChild(image);
          child.appendChild(description);

          child.addEventListener( "click", function() {
        
            catDiv.classList.add( 'hidden' )
            catDiv.innerHTML = '';

            results.classList.remove('hidden');
            results.innerHTML = '';
            
            const detailsUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat.strCategory}`;
            
            axios.get(detailsUrl)
              .then(response => {
                // Format and display article details in the details div
                for( const meal of response.data.meals){
          
                  console.log( meal.mealId );
          
                  results.innerHTML += `
                  <div class="meal" id="${meal.idMeal}">
                    <img src=${meal.strMealThumb} alt="${meal.strMeal} Thumbnail" width="100" height="100" id="${meal.idMeal}">
                    <div id="${meal.idMeal}">
                      <h3 id="${meal.idMeal}">${meal.strMeal}</h1>
                    </div>
                  </div>
                  `;
                }
                // each article
          
              }) // .then()
              .catch( function( err ){
              
                console.log( `Error loading search results`, err );
          
                results.innerHTML = 'There was an error performing the search. Please try again.';
          
              });
          })
          
          catDiv.appendChild(child);
        }
      
      })

}

//slideshow functions

function fadeOut(){
  intervalId = setInterval(hide, 20);
}

function hide(){
  let slide = document.getElementById( 'content-container' );
  let opacity = 0;
  opacity = Number( window.getComputedStyle(slide).getPropertyValue("opacity") );
  if(opacity > 0){
    opacity = opacity - 0.01;
    slide.style.opacity = opacity;
  }
  else{
    clearInterval(intervalId);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runSlideShow(){
  fadeOut();
  sleep(2000).then(() => {   loadSlide(); });
}

//Event listeners

searchForm.addEventListener('submit', function(ev){

    ev.preventDefault(); // Don't reload the page!
  
    console.log( 'user input:', searchItem.value );

    randomDiv.innerHTML = '';
    randomDiv.classList.add('hidden');
    clearInterval(intervalIdSearch);
  
    results.classList.remove('hidden');
    results.innerHTML = '';
    detailsDiv.classList.add('hidden');

    searched = 1;
  
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${ searchItem.value }`;
  
    axios.get(url)
      .then( function( response ){
        
        console.log( response.data );
  
        // resultsDiv.innerHTML = response.data.results;
  
        for( const meal of response.data.meals){
        
          console.log( meal.idMeal );
  
          results.innerHTML += `
            <div class="meal" id="${meal.idMeal}">
              <img src=${meal.strMealThumb} alt="${meal.strMeal} Thumbnail" width="100" height="100" id="${meal.idMeal}">
              <div id="${meal.idMeal}">
                <h3 id="${meal.idMeal}">${meal.strMeal}</h1>
              </div>
            </div>
          `;
        }
        // each article
  
      }) // .then()
      .catch( function( err ){
      
        console.log( `Error loading search results`, err );
  
        results.innerHTML = 'There was an error performing the search. Please try again.';
  
      });
    }
)

results.addEventListener('click', ev => {

    if( ev.target.nodeName === 'DIV' || ev.target.nodeName === 'H3' || ev.target.nodeName === 'IMG' || ev.target.nodeName === 'P'){
          
          const mealId = ev.target.id;
      
          // Construct the URL for fetching article details
          const detailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
      
          axios.get(detailsUrl)
            .then(response => {
              const data = response.data;
              // Format and display article details in the details div
              let ingredients = [];
              let count = 1;

              for (let i in data.meals[0]) {
                let ingredient = "";
                let measure = "";
                if (i.startsWith("strIngredient") && data.meals[0][i]) {
                  ingredient = data.meals[0][i];
                  measure = data.meals[0][`strMeasure` + count];
                  count += 1;
                  ingredients.push(`${measure} ${ingredient}`);
                }
              }

              detailsDiv.innerHTML = `
              <div class="recipe">
              <img src="${data.meals[0].strMealThumb}" alt="Selected Recepie" width="200" height="200">
              <div class="title"><h1> ${data.meals[0].strMeal} </h1></div>
              <div class="recipe-body">
                <h1 id="IngList"> Ingredients </h1>
                <div id="ingred-list" style="display: flex;">
                  <div id="ingred-cont">
                  </div>
                </div>
                <div class="instruct">
                  <h1> Intructions </h1>
                  <p>${data.meals[0].strInstructions}</p>
                  <p> Source: ${data.meals[0].strSource} <p>
                </div>
              </div>
              </div>
                `;

                let ingCon = document.getElementById("ingred-cont");
                let parent = document.createElement("ul");

                ingredients.forEach( (i) => {
                  let child = document.createElement("li");
                  child.innerText = i;
                  parent.appendChild(child);
                  ingCon.appendChild(parent);
                })
      
              // Show the detailsDiv and hide the resultsDiv
              detailsDiv.classList.remove('hidden');
              results.classList.add('hidden');
            })
            .catch(err => {
              console.log('Error loading article details', err);
              // Handle errors, maybe display a message to the user
            });
        }
    }
)

//Slideshow
if(searched === 0){
  loadSlide();
  intervalIdSearch = setInterval(runSlideShow, 15000);
}







