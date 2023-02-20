currentPage=1;

const handleInfiniteScroll = () => {
    const endOfPage =
     window.innerHeight + window.scrollY >= document.body.offsetHeight-10;

    if (endOfPage) {
      appendContent(++currentPage)
    }

   /* if (currentPage === pageCount) {
      removeInfiniteScroll();
    }
    */
};

const removeInfiniteScroll = () => {
  loader.remove();
  window.removeEventListener("scroll", handleInfiniteScroll);
};

function appendContent(page){
  const divShowData = document.getElementById("hely");
  myData = getData("/kereses/"+page);
  myData.then(result => {
    nextPage=page+1;
    divShowData.innerHTML+=result;
  })
}

function formTojsString(formIdname){
    adatForm = document.getElementById(formIdname);
    const formData = new FormData(adatForm);
    var object = {};
    formData.forEach(function (value, key) {
        object[key] = value;
    });
    var jsString = JSON.stringify(object);
return jsString;
}

async function getData(url){ 
    
    res = await fetch(url,{
        method: 'GET'
    }
    )
   return res.text();
}

  window.addEventListener("scroll", handleInfiniteScroll);  
