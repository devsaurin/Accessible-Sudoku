MenuController = function() {
    var sender = this;
    var sudokuGameController;
    this.voiceOverManager;

	var initOptionsScreen = function() {
        var localStorage = new LocalStorageRepository();
        
        $(".optionsMenu li").first().addClass("selected");
        
        $(".optionsMenu li").mouseover(function() {
            $(".optionsMenu li").removeClass("selected");
            $(this).addClass("selected");
        });
        
        var triggerSelectedAction = function() {
            var currentlySelected = $(".optionsMenu li.selected");
            
            //Perform action
            switch(currentlySelected.attr("data-action")) {
                case "theme":
                    
                    // Gets the comma-seperated values from the data-options attrib.
                    var attribute = $(currentlySelected).data("options");
                    
                    // Splits them up into an array, seperated by ','
                    var attribute_split = attribute.split(",");
                    
                    // Gets the current value thats shown on screen.
                    var screen_value = $(currentlySelected).children()[1].innerHTML;
                    
                    // The next value
                    var new_screen_value = null;
                    
                    // Tries to find the next value, comparing the current value on screen with whats next in the array.
                    for (var i = 0; i < attribute_split.length; i++) 
                    {
	                    if (attribute_split[i] == screen_value) {
	                    	if (i < attribute_split.length - 1) {
		                    	new_screen_value = attribute_split[i + 1];
		                    } else {
			                    new_screen_value = attribute_split[0];
		                    }
	                    }
                    }
                    
                    // Put the new value on the screen
                    $(currentlySelected).children()[1].innerHTML = new_screen_value;
                    
                    break;
                case "textSize":
                    alert('Clicked the text size button');
                    break;
                case "fontStyle":
                    alert('Clicked the font style button');
                    break;
            }
        };
        
        $(".optionsMenu li").click(function() {
            triggerSelectedAction();
        });
        
        $(window).keydown(function(evt) {
            if($("#optionsScreen").is(":visible")) {
                var currentlySelected = $(".optionsMenu li.selected");
                switch(evt.which) {
                    case 38: // w
                    case 87: // up
                        if(currentlySelected.prev(":visible").length) {
                            currentlySelected.prev(":visible").addClass("selected");
                            currentlySelected.removeClass("selected");
                        }
                        break;
                    case 40: // s
                    case 83: // down
                        if(currentlySelected.next(":visible").length) {
                            currentlySelected.next(":visible").addClass("selected");
                            currentlySelected.removeClass("selected");
                        }
                        break
                    case 13:
                        triggerSelectedAction();
                        break;
                }
            }
        });

        /*$("html").addClass(localStorage.GetValueForKey("theme"));
        $("html").addClass(localStorage.GetValueForKey("size"));
        $("html").addClass(localStorage.GetValueForKey("font"));

        $("#themeSwitch li").click(function() {
            var validSizeThemes = "normal dark-on-light light-on-dark";
            var newTheme = $(this).attr("data-theme-name");
            localStorage.SetValueForKey("theme", newTheme);
            $("html").removeClass(validSizeThemes).addClass(newTheme);
        });

        $("#sizeSwitch li").click(function() {
            var validSizeThemes = "standard bigger biggest";
            var newSizeTheme = $(this).attr("data-theme-name")
            localStorage.SetValueForKey("size", newSizeTheme);
            $("html").removeClass(validSizeThemes).addClass(newSizeTheme);
        });

        $("#fontSwitch li").click(function() {
            var validSizeThemes = "standard-font dyslexic";
            var newFont = $(this).attr("data-theme-name")
            localStorage.SetValueForKey("font", newFont);
            $("html").removeClass(validSizeThemes).addClass(newFont);
        });*/
    };

    var initMenuScreen = function() {
        var localStorage = new LocalStorageRepository();

        if(localStorage.GetValueForKey("gameSave") == null) {
            $("#buttonContinue").hide();
        }

        $(".mainMenu li:visible").first().addClass("selected");

        $(".mainMenu li").mouseover(function() {
            $(".mainMenu li").removeClass("selected");
            $(this).addClass("selected");
        });

        var triggerSelectedAction = function() {
            var currentlySelected = $(".mainMenu li.selected");
            currentlySelected.addClass("animated bounceOutRight");
            setTimeout(function() {
                $("#menuScreen").addClass("animated bounceOutRight");
                setTimeout(function() {
                    //Reset menu
                    $(".mainMenu li").removeClass("selected");
                    removeAnimations($("#menuScreen li"));
                    $("#menuScreen li").show();

                    //Perform action
                    switch(currentlySelected.attr("data-action")) {
                        case "continue":
                            var existingGame = JSON.parse(localStorage.GetValueForKey("gameSave"));
                            console.log(existingGame);
                            sudokuGameController = new SudokuGameController(existingGame);

                            $("section.screen").hide();
                            $("#gameScreen").addClass("animated bounceInLeft");
                            $("#gameScreen").show();
                            break;
                        case "newGame":
                            var gameGenerator = new Generator();
                            var newGame = new SudokuViewModel();
                            newGame.Squares = gameGenerator.generateGrid();
                            localStorage.SetValueForKey("gameSave", ko.toJSON(newGame));
                            console.log(localStorage.GetValueForKey("gameSave"));
                            sudokuGameController = new SudokuGameController(newGame);

                            $("section.screen").hide();
                            $("#gameScreen").addClass("animated bounceInLeft");
                            $("#gameScreen").show();
                            break;
                        case "options":
                            $("section.screen").hide();
                            $("#optionsScreen").addClass("animated bounceInLeft");
                            $("#optionsScreen").show();
                            break;
                        case "help":
                            $("section.screen").hide();
                            $("#helpScreen").addClass("animated bounceInLeft");
                            $("#helpScreen").show();
                            break;
                    }
                }, 400);
            }, 100);
        };

        $(".mainMenu li").click(function() {
            triggerSelectedAction();
        });

        $(window).keydown(function(evt) {
            if($("#menuScreen").is(":visible")) {
                var currentlySelected = $(".mainMenu li.selected");
                switch(evt.which) {
                    case 38: // w
                    case 87: // up
                        if(currentlySelected.prev(":visible").length) {
                            currentlySelected.prev(":visible").addClass("selected");
                            currentlySelected.removeClass("selected");
                        }
                        break;
                    case 40: // s
                    case 83: // down
                        if(currentlySelected.next(":visible").length) {
                            currentlySelected.next(":visible").addClass("selected");
                            currentlySelected.removeClass("selected");
                        }
                        break
                    case 13:
                        triggerSelectedAction();
                        break;
                }
            }
        });
    };

    var initMainMenuButton = function() {
        var navigateToMenu = function() {
            if(!$("#menuScreen:visible").length) {
                $(".screen:visible").first().addClass("animated bounceOutLeft");
                setTimeout(function() {
                    removeAnimations($(".screen"));
                    $(".screen").hide();
                    $("#menuScreen").show().addClass("animated bounceInRight");
                    $(".mainMenu li:visible").first().addClass("selected"); //Select first item
                }, 400);
            }
        };

        $(".screen header .back").click(function() {
            navigateToMenu();
        });

        $(window).keydown(function(evt) {
            if(evt.which == 27) { //Esc
                navigateToMenu();
            }
        });
    };

    var init = new function() {
        this.voiceOverManager = new VoiceOverManager();

    	initOptionsScreen();
        initMenuScreen();
        initMainMenuButton();
    };
};