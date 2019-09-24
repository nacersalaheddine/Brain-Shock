
(function(){
	

	const aboutNavBtn = document.getElementById("about-btn");
	const overLayNavElement = document.getElementById("myNav");
	const outputTextElement = document.getElementById("text");
	const closeOverlayBtn = document.getElementsByClassName("closebtn")[0];
	
    const txt = '"Brain Shock" Made with coffee & some </>, by Nacer Salah Eddine ! contact me @ nacersalaheddine05@gmail.com'; /* The text */
    const speed = 100; /* The speed/duration of the effect in milliseconds */
    let current, isTyping = false;
	let i;
	
	
	aboutNavBtn.addEventListener('click',function(){
		isTyping = true;
        // document.getElementById("myNav").style.height = "100%";
        overLayNavElement.style.height =  "100%";
		
        current = ' ';
        i = 0;
        typeWriter();
		
		
	});
	
	closeOverlayBtn.addEventListener('click',function(){
        isTyping = false;
        // document.getElementsByClassName("").style.height = "0%";
		overLayNavElement.style.height = "0%";
        current = ' ';
        i = 0;
        outputTextElement.textContent = current;
		
	});

	function typeWriter() {
        if (isTyping) {
            //console.log("typing");
            if (i < txt.length) {
                current += txt.charAt(i);
                outputTextElement.textContent = current;
                i++;
                setTimeout(typeWriter, speed);
            }
        } else {
            return;
        }

    }
	
}());

/*

    $("a#myInfo-btn").click(function() {
        isTyping = true;
        // document.getElementById("myInfo").style.height = "100%";
        $("#myInfo").css("height", "80%");
        $("#myInfo").css({
            "color": "white",
            "background-color": "#fff",
            "opacity": "0.9",

        });

    });

*/