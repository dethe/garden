		// Some suggested refactorings
		// √ 1. Move all CSS properties out of style="" attributes into classes in stylesheet
		// √ 2. Move all CSS properties our of javascript and into classes in stylesheet
		// √ 3. Move DOM finding elements into querySelector or querySelectorAll
		// √ 4. Save variables for commonly used DOM elements
		// 5. Instead of anonymous functions for events, use named, reusable functions
		// √ 6. Use classes instead of ids in CSS
		// 7. Use classes instead of descendant selectors like #someid div
		var editmode = true; // show the plus button?

		var new_storylet = {
			option: '',
			title: '',
			text: ''
		}
		
		var current;

		database.ref('first').once('value', function(snapshot){
			if(current === undefined){current = snapshot.val()};
			update();
		});

		// Components of the default view
		var showStorylet = document.querySelector('.show-storylet');
		var title = document.querySelector('.title');
		var description = document.querySelector('.description');
		var options = document.querySelector('.options');
		var addAction = document.querySelector('.add-action');

		// Components for adding a new option
		var createContent = document.querySelector('.create-content');
		var createOption = document.querySelector('.create-option');
		var createStoryletAction = document.querySelector('.create-storylet-action');

		// Components for filling in the new option page
		var createStorylet = document.querySelector('.create-storylet');
		var createTitle = document.querySelector('.create-title');
		var createDescription = document.querySelector('.create-description');
		var createOptionAction = document.querySelector('.create-option-action');

		// This is always shown
		var storyletCount = document.querySelector('.storylet-count');

		// if(editmode){
		// 	createContent.classList.remove('hide');
		// }

		addAction.addEventListener('click', addActionHandler, false);

		function addActionHandler(evt){
			// showStorylet.classList.add('hide');
			createContent.classList.remove('hide');
			addAction.classList.add('hide');
			createOption.focus();
		}

		createStoryletAction.onclick = function(){
			var value = createOption.value;
			createOption.value = '';
			if(value.length > 0){
				new_storylet.option = value;
				createContent.classList.add('hide');
				showStorylet.classList.add('hide');
				addAction.classList.remove('hide');
				createStorylet.classList.remove('hide');
				createTitle.value = '';
				createDescription.value = '';
				createTitle.focus();
			}
		}

		createOptionAction.onclick = function(){
			new_storylet.title = createTitle.value;
			new_storylet.text = createDescription.value;
			createStorylet.classList.add('hide');
			showStorylet.classList.remove('hide');
			database.ref('storylets/'+current+'/options').push([new_storylet.option, new_storylet.title])

			database.ref('storylets/'+new_storylet.title).set({
				"options":[],
				"text":new_storylet.text
			})

			update();
		}

		function update(){

			options.innerHTML = "";

			database.ref('storylets/'+current+'/options').off();
			database.ref('storylets/'+current+'/options').on('child_added', function(snapshot){
				var element = document.createElement('li');
				var a = document.createElement('a');
				element.appendChild(a);
				a.textContent = snapshot.val()[0];
				a.setAttribute('href', snapshot.val()[1]);
				a.onclick = function(evt){
					evt.preventDefault();
					database.ref('storylets/'+current+'/options').off();
					current = a.getAttribute('href');
					update();
				};
				options.appendChild(element);
			});

			database.ref('storylets/'+current).once('value', function(snapshot){
				title.textContent = current;
				description.textContent = snapshot.child('text').val();
			});
		}

		database.ref('storylets').on('value', function(snapshot){
			storyletCount.textContent = Object.keys(snapshot.val()).length + ' total storylets';
		})
