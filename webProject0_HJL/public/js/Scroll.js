currentPage=1;

const handleInfiniteScroll = () => {
    const endOfPage =
     window.innerHeight + window.scrollY >= document.body.offsetHeight;

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

let tableFromJson = (jsonData) => {

    let col = [];
    for (let i = 0; i < jsonData.length; i++) {
      for (let key in jsonData[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }
    // Create table.
    const table = document.createElement("table");
    table.setAttribute('id', 'customers');

    // Create table header row using the extracted headers above.
    let tr = table.insertRow(-1);                   // table row.

    for (let i = 0; i < col.length; i++) {
      let th = document.createElement("th");      // table header.
      th.innerHTML = col[i];
      tr.appendChild(th);
    }

    // add json data to the table as rows.
    for (let i = 0; i < jsonData.length; i++) {
      tr = table.insertRow(-1);
      for (let j = 0; j < col.length; j++) {
        let tabCell = tr.insertCell(-1);
        tabCell.innerHTML = jsonData[i][col[j]];
      }
    }
    return table;
  }

function addOrderToTable()  
{
  // Order by TableHeader Plain Javascript (ES6)
	const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

	const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

	// do the work...
	document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
		const table = th.closest('table');
		Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
			.sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
			.forEach(tr => table.appendChild(tr) );
	})));    
}      


function fillList(url){ 
    fetch(url,{
        method: 'GET'
    }
    )
        .then((response) => response.json())
        .then((data) => {
            let ki = "";
            ki += "<table id='customers'>";
            ki += "<tr><th>Cím</th><th>Leírás</th><th>Publikus</th></tr>"
            data.forEach(element => {
                ki += "<tr><td>";
                ki += element.title;
                ki += "</td>";

                ki += "<td>";
                ki += element.description;
                ki += "</td>";

                ki += "<td>";
                ki += element.published == true ? "Igen" : "Nem";
                ki += "</td>";

            });
            ki += "</table>";
            document.getElementById("hely").innerHTML= ki;
        }
        )
    }

function sendData(url,method,bodyStr){
    console.log(url, method);
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: bodyStr
    })
        .then((response) => response.text())
        .then((text) => {
            console.log("OK "+text);
            document.getElementById("msg").innerHTML="A mentés sikerült."
        }
        )
        .catch((error) => {
            document.getElementById("msg").innerHTML="Hiba történt!"
            console.error(error)
        });
}


function xgetJson(url){ 
    fetch(url,{
        method: 'GET'
    }
    )
        .then((response) => rv = response.json())
        .then((data) => {console.log(data);})
    }

let xxtableFromJson = (jsonData) => {
    /* the json data.
    const myBooks = [
      {'Id': '1', 'Book Name': 'Challenging Times',
       'Category': 'Business', 'Price': '125.60'
      },
      {'Id': '2', 'Book Name': 'Learn JavaScript',
       'Category': 'Programming', 'Price': '56.00',
      },
      {'Id': '3', 'Book Name': 'Popular Science',
       'Category': 'Science', 'Price': '210.40'
      }
    ]
    */

    // Extract value from table header. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    let col = [];
    for (let i = 0; i < jsonData.length; i++) {
      for (let key in jsonData[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }

    // Create table.
    const table = document.createElement("table");

    // Create table header row using the extracted headers above.
    let tr = table.insertRow(-1);                   // table row.

    for (let i = 0; i < col.length; i++) {
      let th = document.createElement("th");      // table header.
      th.innerHTML = col[i];
      tr.appendChild(th);
    }

    // add json data to the table as rows.
    for (let i = 0; i < jsonData.length; i++) {

      tr = table.insertRow(-1);

      for (let j = 0; j < col.length; j++) {
        let tabCell = tr.insertCell(-1);
        tabCell.innerHTML = jsonData[i][col[j]];
      }
    }

    // Now, add the newly created table with json data, to a container.
    const divShowData = document.getElementById('showData');
    //divShowData.innerHTML = "";
    //divShowData.appendChild(table);
	
	// Order by TableHeader Plain Javascript (ES6)
	const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

	const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

	// do the work...
	document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
		const table = th.closest('table');
		Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
			.sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
			.forEach(tr => table.appendChild(tr) );
	})));
    return table;
  }

  window.addEventListener("scroll", handleInfiniteScroll);  
