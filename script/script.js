
const createElement = (arr) => {

    const htmlElement = arr.map(el => `<span class= "btn"> ${el}</span>`)
    return htmlElement.join(" ")
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const removeHidden = (status) => {

    const loadingContainer = document.getElementById("loading-container");
    const cardsSection = document.getElementById("cards-section");

    if (status == true) {
        
        loadingContainer.classList.remove("hidden")
        cardsSection.classList.add("hidden")

    } else{
        
        cardsSection.classList.remove("hidden")
        loadingContainer.classList.add("hidden")

    }


}

const lessonLoad = () => {

    const url = ("https://openapi.programming-hero.com/api/levels/all");
    fetch(url)
        .then((res) => res.json())
        .then(data => displayLesson(data.data))
}


const loadWord = (id) => {

    removeHidden(true)

    const url = (`https://openapi.programming-hero.com/api/level/${id}`)
    fetch(url)
        .then((res) => res.json())
        .then(data => {
            
            toggleBtn(id)

            displayWord(data.data)
            
            
        })

}


const toggleBtn = (id) => {

    const lessonBtnClass = document.querySelectorAll(".lesson-btn");
    
    lessonBtnClass.forEach(btns => {
        btns.classList.remove("active");
    });
    
    const activeBtn = document.getElementById(`lesson-Btn-${id}`)
    activeBtn.classList.add("active")
}




const loadDetailWord = (id) => {

    const url = (`https://openapi.programming-hero.com/api/word/${id}`);
    fetch(url)
    .then(res => res.json())
    .then(data => displayDetails(data.data))
} 



// {
//     "status": true,
//     "message": "successfully fetched a word details",
//     "data": {
//         "word": "Eager",
//         "meaning": "আগ্রহী",
//         "pronunciation": "ইগার",
//         "level": 1,
//         "sentence": "The kids were eager to open their gifts.",
//         "points": 1,
//         "partsOfSpeech": "adjective",
//         "synonyms": [
//             "enthusiastic",
//             "excited",
//             "keen"
//         ],
//         "id": 5
//     }
// }



const displayDetails = (word) => {

    
    const detailContainer = document.getElementById("detail-container");
    detailContainer.innerHTML = `
    
        <h1 class="text-4xl font-semibold ">${word.word} <span>(<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation})</span></h1>
                
                <div class="">
                    <p class="text-2xl font-semibold">Meaning</p>
                    <p class="text-2xl font-medium font-bangla">${word.meaning}</p>
                </div>
                <div class="">
                    <p class="text-2xl font-semibold">Example</p>
                    <p class="text-2xl">${word.sentence}</p>
                </div>
                <div class="">
                    <p class="text-2xl font-medium font-bangla">সমার্থক শব্দ গুলো</p>
                    <div class="mt-3" >
                         ${createElement(word.synonyms)}
                        
                    </div>
                </div>
                <button class="btn btn-primary">Complete Learning</button>
    
    `
    document.getElementById("my_modal_5").showModal()

}






const displayWord = (words) => {

    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        
        wordContainer.innerHTML = `
        
            <div class="text-center py-20 space-y-5 col-span-full">

                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="font-bangla text-xl text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="font-bangla font-medium text-4xl text-[#292524]">নেক্সট Lesson এ যান</h1>
            </div>

        `

        removeHidden(false)
        return
    }

    words.forEach(word => {

        const wordCard = document.createElement("div");
        wordCard.innerHTML = `
        <div class="card bg-base-100 shadow-sm p-5">
                
                <div class="card-body items-center text-center ">
                    <h2 class="font-bold text-2xl">${word.word ? word.word : "Not Found /"}</h2>
                    <p class="font-semibold">Meaning /Pronounciation</p>
                    <div class="font-bangla text-2xl font-medium text-[#18181B]">"${word.meaning ? word.meaning : "Not Found /"} ${word.pronunciation ? word.pronunciation : "Not Found /"}"</div>

                </div>
                
                <div class="flex justify-between ">
                    <button onclick= "loadDetailWord(${word.id})"  class="btn  text-[#374957] bg-[#1a90ff10] hover:bg-[#1a90ff80]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn text-[#374957] bg-[#1a90ff10] hover:bg-[#1a90ff80]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `

        wordContainer.append(wordCard)
    });

    removeHidden(false)

}

const displayLesson = (lessons) => {

    const lessonContainer = document.getElementById("lesson-container");
    lessonContainer.innerHTML = ""

    lessons.forEach(lesson => {


        const lessonBtn = document.createElement("div");
        lessonBtn.innerHTML = `

             <button id ="lesson-Btn-${lesson.level_no}" 
            onclick ="loadWord(${lesson.level_no})"
            class = "btn btn-primary btn-outline lesson-btn">
            <i class="fa-solid fa-book-open"></i> 
            Lesson ${lesson.level_no}</button>
        
        `

        lessonContainer.appendChild(lessonBtn)

    });


}


document.getElementById("search-btn").addEventListener("click", () => {

    const input = document.getElementById("search-input");
    const inputValue = input.value.toLowerCase().trim();

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {

        const allWord = data.data
        
        const filterWord = allWord.filter(word => word.word.toLowerCase().trim().includes(inputValue)  ) 
        
        displayWord(filterWord)
    })

    
})






lessonLoad()