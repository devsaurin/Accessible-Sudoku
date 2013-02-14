OptionsController = function(_voiceOverManager) {
    var sender = this;
    var voiceOverManager = _voiceOverManager;

    var loadUserPreferences = function() {
        var localStorage = new LocalStorageRepository();

        $(".optionsMenu .menuItem").each(function() {
            if((!$(this).parent("li").hasClass("desktop-only")) || $("html").hasClass("desktop")) {
                var initialValue = localStorage.GetValueForKey($(this).attr("data-optionId"));
                initialValue = initialValue == null ? $(this).attr("data-options").split(",")[0] : initialValue;
                initialValue = initialValue.substring(1, initialValue.length - 1);

                var key = initialValue.split(":")[0];
                var value = initialValue.split(":")[1];

                $(this).attr("data-selectedKey", key);
                $(this).children(".value").text(value);

                if(key.indexOf('-') > 0) { //is data setting
                    $("html").attr("data-"+key.split('-')[0], key.split('-')[1]);
                } else { //is style setting
                    $("html").addClass(key);
                }
            }
        });
    };

    var initOptionsScreenControles = function() {
        //Mouse input
        $(".optionsMenu li").mouseenter(function() {
            $(".optionsMenu .menuItem").removeClass("selected");
            $(".optionsMenu .menuItem").siblings(".rightArrow, .leftArrow").css("display", "none");
            $(this).children(".rightArrow, .leftArrow").css("display", "inline-block");
            $(this).children(".menuItem").addClass("selected");

            //Animation
            $(this).addClass("animated pulse");
            menuItemAnimation = cleanUpAnimationAfterTimeout($(this), 400);
        });
        $(".optionsMenu .menuItem").click(function() {
            changeOption("right");
        });
        $(".optionsMenu .leftArrow").click(function() {
            changeOption("left");
        });
        $(".optionsMenu .rightArrow").click(function() {
            changeOption("right");
        });

        var menuItemAnimation;

        //Keyboard input
        $(window).keydown(function(evt) {
            if($("#optionsScreen").is(":visible")) {
                var currentlySelected = $(".optionsMenu .menuItem.selected");

                var handled = true;
                switch(keyCodeToAction(evt.which)) {
                    case "up":
                        var newSelection = currentlySelected.parent("li").prev(":visible").find(".menuItem");
                        if(newSelection.length) {
                            newSelection.addClass("selected");
                            newSelection.parent("li").addClass("animated pulse");
                            newSelection.siblings(".leftArrow, .rightArrow").css("display", "inline-block");
                            menuItemAnimation = cleanUpAnimationAfterTimeout(newSelection.parent("li"), 400);
                            currentlySelected.removeClass("selected");
                            currentlySelected.siblings(".leftArrow, .rightArrow").css("display", "none");

                            voiceOverManager.OutputMessage(newSelection.find(".name").text());
                        }
                        break;
                    case "down":
                        var newSelection = currentlySelected.parent("li").next(":visible").find(".menuItem");
                        if(newSelection.length) {
                            newSelection.addClass("selected");
                            newSelection.parent("li").addClass("animated pulse");
                            newSelection.siblings(".leftArrow, .rightArrow").css("display", "inline-block");
                            menuItemAnimation = cleanUpAnimationAfterTimeout(newSelection.parent("li"), 400);
                            currentlySelected.removeClass("selected");
                            currentlySelected.siblings(".leftArrow, .rightArrow").css("display", "none");

                            voiceOverManager.OutputMessage(newSelection.find(".name").text());
                        }
                        break
                    case "left":
                        changeOption("left");
                        break;
                    case "right":
                        changeOption("right");
                        break;
                    default:
                        handled = false;
                        break;
                }
                if(handled) {
                    evt.preventDefault();
                }
            }
        });
        
        var leftArrowAnimation;
        var rightArrowAnimation;
        var changeOption = function(direction) {
            var localStorage = new LocalStorageRepository();
            
            var currentlySelected = $(".optionsMenu .menuItem.selected");

            var availableOptions = currentlySelected.data("options").split(",");
            var origionalKey = currentlySelected.attr("data-selectedKey");
            if(origionalKey.indexOf('-') < 0) { //is style settting
                $("html").removeClass(origionalKey);
            }

            for(var i = 0; i < availableOptions.length; i++) {
                var key = availableOptions[i].substring(1, availableOptions[i].length - 1).split(":")[0];
                var value = availableOptions[i].substring(1, availableOptions[i].length - 1).split(":")[1];

                if(origionalKey == key) {
                    var newIndex = (direction == "left") ? (i - 1) : (i + 1);
                    newIndex = (newIndex >= availableOptions.length) ? 0 : newIndex;
                    newIndex = (newIndex < 0) ? availableOptions.length - 1 : newIndex;
                    var newKey = availableOptions[newIndex].substring(1, availableOptions[newIndex].length - 1).split(":")[0];
                    var newValue = availableOptions[newIndex].substring(1, availableOptions[newIndex].length - 1).split(":")[1];

                    localStorage.SetValueForKey(currentlySelected.attr("data-optionId"), availableOptions[newIndex]);
                    $(currentlySelected).attr("data-selectedKey", newKey);
                    $(currentlySelected).children(".value").html(newValue);

                    if(newKey.indexOf('-') > 0) { //is data setting
                        $("html").attr("data-"+newKey.split('-')[0], newKey.split('-')[1]);
                    } else { //is style setting
                        $("html").addClass(newKey);
                    }

                    voiceOverManager.OutputMessage(currentlySelected.children(".name").text() + " - " + newValue);

                    if(direction == "left") {
                        var toAnimate = $(currentlySelected).siblings(".leftArrow");
                        clearTimeout(leftArrowAnimation);
                        removeAnimations(toAnimate)
                        toAnimate.addClass("animated shake");
                        leftArrowAnimation = cleanUpAnimationAfterTimeout(toAnimate, 500);
                    } else {
                        var toAnimate = $(currentlySelected).siblings(".rightArrow");
                        clearTimeout(rightArrowAnimation);
                        removeAnimations(toAnimate)
                        toAnimate.addClass("animated shake");
                        rightArrowAnimation = cleanUpAnimationAfterTimeout(toAnimate, 500);
                    }
                }
            }
        };
    };

    var init = new function() {
        loadUserPreferences();
        initOptionsScreenControles();
    };
};