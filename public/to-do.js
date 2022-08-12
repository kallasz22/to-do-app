fetch('/load')
.then(function(data){
    return data.json();
})
.then(function(items){
    for (let i = 0; i < items.length; i++) {
        let li = document.createElement('li');
        li.innerText = items[i].item + " tag:" + items[i].tag;

        if (items[i].tag != '') {
            let option = document.createElement('option');
            option.value = items[i].tag;
            option.innerText = items[i].tag;
            document.querySelector('select').appendChild(option);
        }
        


        document.querySelector('ul').appendChild(li);
    }
});
document.querySelector('select').addEventListener('change', async function(){
    if (this.value == "new-tag") {
        const a = prompt('Please enter a tag!');
        let newOption = document.createElement('option');
        newOption.value = a;
        newOption.innerText = a;
        this.appendChild(newOption);
    }
});
