
    (function () {

		// 'view area' parameters - define the part of the M Set we're looking at
        var magnificationFactor = 400; // 8500;
        var offsetX = -2; //left hand side starting position - negative most real number of view set
        var offsetY = -1; //top starting position - largest imaginary number of view set


		// javascript black magic to allow a user selection rectangle to work...
        var div = document.getElementById('set');
        div.addEventListener('mousedown', mousedown, {capture: true});
        div.addEventListener('mouseup', mouseup, {capture: true});
        div.addEventListener('mousemove', mousemove, {capture: true});

		// (need to disable mouse listeners for images to get UX to work smoothly)
		var images = document.getElementsByTagName("img");
		for (i = 0; i < images.length; i++) {
		  images[i].addEventListener('mousedown', function(event){event.preventDefault()});
		} 

		// define the size of view screen (currently set to 1200x800 in css)
		var displayWidth = div.clientWidth;
		var displayHeight = div.clientHeight;
		
		// rectangle displays the area of the set to 'zoom in on'
        var rect = {
            x0: 0,
            y0: 0,
            x1: displayWidth,
            y1: displayHeight
        };

		// do the initial display render
		resetImages(rect);

		// reset rectangle so it can be used for selection
		rect.x1 = 0;
		rect.y1 = 0;
	

        var grab = false;

        function mousedown(e) {
			console.log("mouse down");
            grab = true;
            rect.x0 = e.clientX;
            rect.y0 = e.clientY;

        }

        function mousemove(e) {
            if (grab) {
                rect.x1 = e.clientX;
                rect.y1 = e.clientY;
                showRect();
            }
        }

        function mouseup(e) {
            grab = false;

			if ((rect.x1 - rect.x0)>50 && (rect.y1 - rect.y0)>50) // ignore small rectangles...
				resetImages(rect);
            var rectDiv = document.getElementById('rect');
			rectDiv.style.display = 'none';
				
        }

        function showRect() {
            var rectDiv = document.getElementById('rect');
			if ((rect.x1 - rect.x0)<50)
				rectDiv.style.borderColor = 'red';
			else		
				rectDiv.style.borderColor = 'blue';
            rectDiv.style.display = 'block';
            rectDiv.style.position = 'absolute';
            rectDiv.style.left = rect.x0 + 'px';
            rectDiv.style.top = rect.y0 + 'px';
            rectDiv.style.width = (rect.x1 - rect.x0) + 'px';
            rectDiv.style.height = (rect.y1 - rect.y0) + 'px';

            var boundsDiv = document.getElementById('bounds');
            boundsDiv.innerText = 'crop rect: ' + rect.x0 + ',' + rect.y0 + ' to ' + rect.x1 + ',' + rect.y1;
        }

		function resetImages(rect) {
			// find bounds of set to display, then break into 6 sub-views...
			
			// reset start positions to be the top left of selection
			offsetX = offsetX + (rect.x0 / magnificationFactor);
			offsetY = offsetY + (rect.y0 / magnificationFactor);
	
			// reset magnification by the new span in the x direction
			magnificationFactor = magnificationFactor * displayWidth / (rect.x1-rect.x0);
			if (magnificationFactor<0) magnificationFactor *= -1;
			
			// break into 6 sub images to compute on the back end nodes...	
			var images = document.getElementsByTagName("img");
			// nb - this assumes 6 images in a 3x2 grid - could make more generic
		    for (i = 0; i < images.length; i++) {  
		  		let x = i % 3;
				let y = Math.floor(i/3);
				
				// calculate the 'view window' on the set of each of the images
				let localX = offsetX + (x*displayWidth/magnificationFactor)/3;		
				let localY = offsetY + (y*displayHeight/magnificationFactor)/2;
				
				// calculate the URL to call the back end node service
				images[i].src="./set?id="+i+"&x="+localX+"&y="+localY+"&mag="+magnificationFactor+"&width=400&height=400";
				
				//x[i].addEventListener('mousedown', function(event){event.preventDefault()});
		    } 
		}

    })();

