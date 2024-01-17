//   loader
$(document).ready(function() {
	$('.overlay, body').addClass('loaded');
		setTimeout(function() {
			$('.overlay').css({'display':'none'})
		}, 2000)
});

// hide-show hotel travellers
$(function() {
	$('.expander').on('click', function() {
	  $('#TableData').toggle();
	});
  });


//   hotel-travelers
$(document).ready(function () {
  var maxRooms = 4;
  var maxAdults = 10; // Maximum value for adult counter
  var maxChildren = 6;
  var isManualAdultInput = false;

  function generateChildAgeOptions(roomNumber, childNumber, numChildren) {
    var optionsHtml = '';
    for (var i = 1; i <= numChildren; i += 1) {
      optionsHtml += '<div class="selected-childs-ages">' +
        '<span class="travel-titl-spans">Child ' + (childNumber + i) + ' age</span>' +
        '<select class="form-select" id="selectbox2">' +
        '<option value="1">Under 1</option>' +
        '<option value="2">1</option>' +
        '<option value="3">2</option>' +
        '<option value="4">3</option>' +
        '<option value="5">4</option>' +
        '<option value="6">5</option>' +
        '<option value="7">6</option>' +
        '<option value="8">7</option>' +
        '<option value="9">8</option>' +
        '<option value="10">9</option>' +
        '<option value="11">10</option>' +
        '<option value="12">12</option>' +
        '</select>' +
        '</div>';
    }
    return optionsHtml;
  }

  function initializeRoom(newRoom) {
    var roomNumber = $('.traveller-rooms').length + 1;

    newRoom.find('h5').html('Room ' + roomNumber + (roomNumber > 1 ? ' <span class="remove-rooms"><i class="fa-solid fa-trash"></i>Delete</span>' : ''));
    newRoom.find('.collapse').removeClass('show').attr('id', 'collapseExample' + roomNumber);
    newRoom.find('[data-bs-toggle="collapse"]').attr('href', '#collapseExample' + roomNumber);

    newRoom.find('.quantity-field').val(2); // Set adult counter to 2 in the new room
    newRoom.find('.quantity-field').attr('max', maxAdults); // Set max value for adult counter
    newRoom.find('.custom-quantity-field').val(0); // Set child counter to 0 in the new room
    newRoom.find('.child-age-opts').empty().hide(); // Clear child age options in the new room

    newRoom.appendTo('#rooms-container');
  }

  function updateChildAgesVisibility(roomContainer) {
    var childAgesDiv = roomContainer.find('.child-age-opts');
    var existingChildSelects = childAgesDiv.find('select');

    var numChildren = parseInt(roomContainer.find('.custom-quantity-field').val(), 10);

    var delayTimer;

    // Block the limit to 6 children
    if (numChildren > maxChildren) {
      numChildren = maxChildren;
      roomContainer.find('.custom-quantity-field').val(numChildren);
    }

    if (numChildren > existingChildSelects.length) {
      // Add new child age selects if the count increases
      childAgesDiv.append(generateChildAgeOptions(roomContainer.index() + 1, existingChildSelects.length, numChildren - existingChildSelects.length));
    } else if (numChildren < existingChildSelects.length) {
      // Remove extra child age selects if the count decreases
      existingChildSelects.slice(numChildren).parent().remove();
    }

    // Show or hide the child ages div based on the count
    childAgesDiv.toggle(numChildren > 0);
  }

  function updateAdultCounterVisibility(roomContainer) {
    var adultCounterDiv = roomContainer.find('.quantity-field');
    var numAdults = parseInt(adultCounterDiv.val(), 10);

    if (numAdults > 0) {
      // Show additional logic if needed for adult counter visibility
    }
  }

  // Counter button click handler
  $('#rooms-container').on('click', '.button-minus, .button-plus', function () {
    var roomContainer = $(this).closest('.traveller-rooms');
    var inputField = roomContainer.find('.quantity-field');
    var currentValue = parseInt(inputField.val(), 10);
    var maxLimit = parseInt(inputField.attr('max'), 10);

    if ($(this).hasClass('button-minus')) {
      if (currentValue > 1) {
        inputField.val(currentValue - 1);
      }
    } else if ($(this).hasClass('button-plus')) {
      if (currentValue < maxLimit) {
        inputField.val(currentValue + 1);
      }
    }

    updateAdultCounterVisibility(roomContainer);
  });

  // Number input change handler for adult
  $('#rooms-container').on('input', '.quantity-field', function (event) {
    var roomContainer = $(this).closest('.traveller-rooms');

    // Check if the change is due to user interaction
    if (event.originalEvent) {
      // Update adult counter visibility
      updateAdultCounterVisibility(roomContainer);
      updateChildAgesVisibility(roomContainer);
    }
  });

  // Counter button click handler for child
  $('#rooms-container').on('click', '.custom-button-minus, .custom-button-plus', function () {
    var roomContainer = $(this).closest('.traveller-rooms');
    var inputField = roomContainer.find('.custom-quantity-field');
    var currentValue = parseInt(inputField.val(), 10);
    var maxLimit = parseInt(inputField.attr('max'), 10);

    if ($(this).hasClass('custom-button-minus')) {
      if (currentValue > 0) {
        inputField.val(currentValue - 1);
      }
    } else if ($(this).hasClass('custom-button-plus')) {
      if (currentValue < maxLimit) {
        inputField.val(currentValue + 1);
      }
    }

    updateChildAgesVisibility(roomContainer);
  });

  // Number input change handler for child
  $('#rooms-container').on('input', '.custom-quantity-field', function () {
    var roomContainer = $(this).closest('.traveller-rooms');

    // Update child age visibility
    updateChildAgesVisibility(roomContainer);
  });

  // Add Room button click handler
  $('.add-room-button').on('click', function () {
    addRoom();
  });

  function addRoom() {
    var currentRooms = $('.traveller-rooms').length;

    if (currentRooms < maxRooms) {
      var newRoom = $('.traveller-rooms:first').clone();
      initializeRoom(newRoom);
      updateAdultCounterVisibility(newRoom); // Update adult counter visibility for the new room
      updateChildAgesVisibility(newRoom);

      // Disable Add Room button if the maximum number of rooms is reached
      if (currentRooms + 1 === maxRooms) {
        $('.add-room-button').prop('disabled', true);
      }
    }
  }

  // Remove Room button click handler
  $('#rooms-container').on('click', '.remove-rooms', function () {
    var roomContainer = $(this).closest('.traveller-rooms');

    if (roomContainer.index() !== 0) {
      roomContainer.remove();

      // Enable Add Room button when a room is removed
      $('.add-room-button').prop('disabled', false);

      // Update room numbers and IDs for the remaining rooms
      $('.traveller-rooms').each(function (index) {
        var roomNumber = index + 1;

        $(this).find('h5').html('Room ' + roomNumber + (roomNumber > 1 ? ' <span class="remove-rooms"><i class="fa-solid fa-trash"></i>Delete</span>' : ''));
        $(this).find('.collapse').attr('id', 'collapseExample' + roomNumber);
        $(this).find('[data-bs-toggle="collapse"]').attr('href', '#collapseExample' + roomNumber);
      });
    }
  });

  // Apply button click handler
  // Function to hide the popup
  function hidePopup() {
    $('.travellers-info-drop').hide();
  }

  // Apply button click handler
  $('.apply-button').on('click', function () {
    hidePopup();
  });

  // Click outside the popup to hide it
  $(document).on('mouseup', function (e) {
    var popup = $('.travellers-info-drop');

    // If the clicked element is not the popup or a child of the popup
    if (!popup.is(e.target) && popup.has(e.target).length === 0) {
      hidePopup();
    }
  });

  // Handle child count change
  $('#rooms-container').on('input', '.quantity-field', function () {
    var numberOfChildren = parseInt($(this).val(), 10);

    $('.selected-childs-ages').hide();

    for (var i = 1; i <= numberOfChildren; i += 1) {
      $('.selected-childs-ages:nth-child(' + i + ')').show();
    }
  });

  // Disable manual input for adult and child counters
  $('#rooms-container').on('keydown', '.quantity-field, .custom-quantity-field', function (e) {
    e.preventDefault();
  });
});



// multicity-functionality
$(document).ready(function() {
	// Click event handler for the search button
	$('#searchButton-multicity').on('click', function(event) {
		// Prevent the default behavior of the anchor tag
		event.preventDefault();

		// Add multicity-search parameter to the URL
		var url = 'flight-result.html?multicity-search=true';

		// Redirect to the URL
		window.location.href = url;
	});

	// Retrieve multicity-search parameter from the URL and add classes to the body tag
	var urlParamsmul = new URLSearchParams(window.location.search);
	var multicitySearchParam = urlParamsmul.get('multicity-search');

	// Check if multicity-search parameter exists and add classes to the body tag
	if (multicitySearchParam && multicitySearchParam.toLowerCase() === 'true') {
		$('body').addClass('searched-multicity');
	}
});

// round-trip -functionality
$(document).ready(function() {
	// Click event handler for the search button
	$('#searchButton-round-trip').on('click', function(event) {
		// Prevent the default behavior of the anchor tag
		event.preventDefault();

		// Add roundtrip-search parameter to the URL
		var url = 'flight-result.html?round-trip-search=true';

		// Redirect to the URL
		window.location.href = url;
	});

	// Retrieve roundtrip-search parameter from the URL and add classes to the body tag
	var urlParams = new URLSearchParams(window.location.search);
	var roundtripSearchParam = urlParams.get('round-trip-search');

	// Check if roundtrip-search parameter exists and add classes to the body tag
	if (roundtripSearchParam && roundtripSearchParam.toLowerCase() === 'true') {
		$('body').addClass('searched-round-trip');
	}
});


// oneway -functionality
$(document).ready(function() {
	// Click event handler for the search button
	$('#searchButton-oneway').on('click', function(event) {
		// Prevent the default behavior of the anchor tag
		event.preventDefault();

		// Addoneway-search parameter to the URL
		var url = 'flight-result.html?oneway-search=true';

		// Redirect to the URL
		window.location.href = url;
	});

	// Retrieveoneway-search parameter from the URL and add classes to the body tag
	var urlParams = new URLSearchParams(window.location.search);
	var onewaySearchParam = urlParams.get('oneway-search');

	// Check ifoneway-search parameter exists and add classes to the body tag
	if (onewaySearchParam && onewaySearchParam.toLowerCase() === 'true') {
		$('body').addClass('searched-oneway');
	}
});




// responsive sidebar code

const menuButton = document.querySelector('.menu-button');
const menuOverlay = document.querySelector('.menu-overlay');
const backgroundOverlay = document.querySelector('.background-overlay');

menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('active');
    menuOverlay.classList.toggle('open');
    backgroundOverlay.classList.toggle('bg-overlay');
});

// main-banner
var swiper = new Swiper(".myBannerSwiper", {
	lazy: true,
	navigation: {
	  nextEl: ".swiper-button-next",
	  prevEl: ".swiper-button-prev",
	},
	autoplay: {
        delay: 4000,
        disableOnInteraction: true,
      },
  });


// change direction

// jQuery
$('input[name="lang"]').on('change', function() {
	location.reload(true);
    const lang = $(this).val();

    // Set the HTML page dir attribute
    $('html').attr('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Store the language in local storage
    localStorage.setItem('lang', lang);
  });

// Get the language from local storage and set the HTML page dir attribute accordingly
const lang = localStorage.getItem('lang');
if (lang) {
  $('html').attr('dir', lang === 'ar' ? 'rtl' : 'ltr');
}


$(document).ready(function() {
  // Check if the 'dir' attribute of <html> tag is 'ar'
  if ($('html').attr('dir') === 'rtl') {
    // If 'dir' attribute is 'ar', include the CSS file
    $('head').append('<link rel="stylesheet" type="text/css" href="css/styles-ar.css">');
    $("#ar").prop('checked', true);
    $('.header-logo').attr('src','image/ar-logo.png');
    $('.ltr-dir-img').attr('src','image/download-rehlte-rtl.png');
    $('.download-app').addClass('rtl-download-app');
  } else {
    // If 'dir' attribute is not 'ar', remove the CSS file
    $('head link[href="styles-ar.css"]').remove();
  }
});




// Iterate over each select element
$('select').each(function () {

    // Cache the number of options
    var $this = $(this),
        numberOfOptions = $(this).children('option').length;

    // Hides the select element
    $this.addClass('s-hidden');

    // Wrap the select element in a div
    $this.wrap('<div class="select"></div>');

    // Insert a styled div to sit over the top of the hidden select element
    $this.after('<div class="styledSelect"></div>');

    // Cache the styled div
    var $styledSelect = $this.next('div.styledSelect');

    // Show the first select option in the styled div
    $styledSelect.text($this.children('option').eq(0).text());

    // Insert an unordered list after the styled div and also cache the list
    var $list = $('<span />', {
        'class': 'options'
    }).insertAfter($styledSelect);

    // Insert a list item into the unordered list for each select option
    for (var i = 0; i < numberOfOptions; i += 1) {
        $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val()
        }).appendTo($list);
    }

    // Cache the list items
    var $listItems = $list.children('li');

    // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
    $styledSelect.click(function (e) {
        e.stopPropagation();
        $('div.styledSelect.active').each(function () {
            $(this).removeClass('active').next('span.options').hide();
        });
        $(this).toggleClass('active').next('span.options').toggle();
    });

    // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
    // Updates the select element to have the value of the equivalent option
    $listItems.click(function (e) {
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.hide();
        /* alert($this.val()); Uncomment this for demonstration! */
    });

    // Hides the unordered list when clicking outside of it
    $(document).click(function () {
        $styledSelect.removeClass('active');
        $list.hide();
    });

});

// single date picker

// INCLUDE JQUERY & JQUERY UI 1.12.1
$(function() {
  $(".datepicker").datepicker({
    dateFormat: "dd-mm-yy",
    duration: "fast",
    minDate: 0, // Set the minimum date to today
    defaultDate: 0 // Set the default date to today
  });

  // Set the datepicker value to today's date
  $(".datepicker").datepicker("setDate", new Date());
});


// increment-decrement

function incrementValue(e) {
    e.preventDefault();
    var fieldName = $(e.target).data('field');
    var parent = $(e.target).closest('div');
    var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

    if (!isNaN(currentVal)) {
        parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
    } else {
        parent.find('input[name=' + fieldName + ']').val(0);
    }
}

function decrementValue(e) {
    e.preventDefault();
    var fieldName = $(e.target).data('field');
    var parent = $(e.target).closest('div');
    var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

    if (!isNaN(currentVal) && currentVal > 0) {
        parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
    } else {
        parent.find('input[name=' + fieldName + ']').val(0);
    }
}

$(document).ready(function() {
	// Function to handle increment and decrement buttons
	$('.input-group').on('click', '.button-minus, .button-plus', function(e) {
		var input = $(this).siblings('.quantity-field');
		var currentVal = parseInt(input.val(), 10);

		if ($(this).hasClass('button-minus')) {
			if (currentVal > 1) {
				input.val(currentVal - 1);
			}
		} else {
			if (currentVal < 10) {
				input.val(currentVal + 1);
			}
		}

		// Disable "Add" button when the maximum limit is reached
		var totalAdults = parseInt(input.val(), 10);
		if (totalAdults >= 10) {
			$(".add").prop("disabled", true);
		} else {
			$(".add").prop("disabled", false);
		}
	});

	// Ensure the input value does not exceed 10 when manually typing
	$(".quantity-field").on("input", function() {
		var value = parseInt($(this).val(), 10);
		if (isNaN(value) || value < 1) {
			$(this).val(1);
		} else if (value > 10) {
			$(this).val(10);
		}

		// Disable "Add" button when the maximum limit is reached
		var totalAdults = parseInt($(this).val(), 10);
		if (totalAdults >= 10) {
			$(".add").prop("disabled", true);
		} else {
			$(".add").prop("disabled", false);
		}
	});
});

// date range picket

var start_date = null, end_date = null;
var timestamp_start_date = null, timestamp_end_date = null;
var $input_start_date = null, $input_end_date = null;

function getDateClass(date, start, end){
	if(end != null && start != null){
		if (date > start && date < end) {
            return [ true, "sejour", "Séjour" ];
        }
	}

	if (date == start) {
        return [ true, "start", "Début de votre séjour" ];
    }
	if (date == end) {
        return [ true, "end", "Fin de votre séjour" ];
    }

	return false;
}

function datepicker_draw_nb_nights(){
	var $datepicker = jQuery("#ui-datepicker-div");
	setTimeout(function(){
		if(start_date != null && end_date != null){
			var $qty_days_stay = jQuery("<div />", { class: "ui-datepicker-stay-duration" });
			var qty_nights_stay = get_days_difference(timestamp_start_date, timestamp_end_date);
			$qty_days_stay.text(qty_nights_stay + "Days");
			$qty_days_stay.appendTo($datepicker);
		}
	});
}

var options_start_date = {
	showAnim: false,
	constrainInput: true,
  	numberOfMonths: 2,
	showOtherMonths: true,
	beforeShow: function(input, datepicker){
		datepicker_draw_nb_nights();
	},
	beforeShowDay: function(date){
		// 0: published
		// 1: class
		// 2: tooltip
		var timestamp_date = date.getTime();
		var result = getDateClass(timestamp_date, timestamp_start_date, timestamp_end_date);
		if (result != false) {
            return result;
        }

		return [true, "", ""];
		// return [ true, "chocolate", "Chocolate! " ];
	},
	onSelect: function(date_string, datepicker){
		// this => input
		start_date = $input_start_date.datepicker("getDate");
		timestamp_start_date = start_date.getTime();
	},
	onClose: function(){
		if(end_date != null){
			if(timestamp_start_date >= timestamp_end_date || end_date == null){
				$input_end_date.datepicker("setDate", null);
				end_date = null;
				timestamp_end_date = null;
				$input_end_date.datepicker("show");
					return;
			}
		}
		if (start_date != null && end_date == null) {
            $input_end_date.datepicker("show");
        }
	}
};
var options_end_date = {
	showAnim: false,
	constrainInput: true,
  	numberOfMonths: 2,
	showOtherMonths: true,
	beforeShow: function(input, datepicker){
		datepicker_draw_nb_nights();
	},
	beforeShowDay: function(date){
		var timestamp_date = date.getTime();
		var result = getDateClass(timestamp_date, timestamp_start_date, timestamp_end_date);
		if (result != false) {
            return result;
        }

		return [ true, "", "Chocolate !" ];
	},
	onSelect: function(date_string, datepicker){
		// this => input
		end_date = $input_end_date.datepicker("getDate");
		timestamp_end_date = end_date.getTime();
	},
	onClose: function(){
		if (end_date == null) {
            return;
        }

		if(timestamp_end_date <= timestamp_start_date || start_date == null){
			$input_start_date.datepicker("setDate", null);
			start_date = null;
			timestamp_start_date = null;
			$input_start_date.datepicker("show");
		}
	}
};


$(function() {
  var startDatePicker = $("#start-date1");
  var returnDatePicker = $("#end-date2");

  startDatePicker.datepicker({
    dateFormat: "dd-mm-yy",
    duration: "fast",
    defaultDate: 0, // Set the default date to today
    onSelect: function(selectedDate) {
      // Update the minDate of the Return Date datepicker
      returnDatePicker.datepicker("option", "minDate", selectedDate);

      // Set the Return Date to the next day
      var selected = new Date(selectedDate);
      selected.setDate(selected.getDate() + 1);
      var formattedNextDay = $.datepicker.formatDate("dd-mm-yy", selected);
      returnDatePicker.datepicker("setDate", formattedNextDay);

      // Update the input value
      updateReturnDateValue(formattedNextDay);
    }
  });

  returnDatePicker.datepicker({
    dateFormat: "dd-mm-yy",
    duration: "fast",
    minDate: 1, // Set the minimum date to tomorrow
    onSelect: function(selectedDate) {
      // Update the input value
      updateReturnDateValue(selectedDate);
    },
    beforeShowDay: function(date) {
      var startDate = startDatePicker.datepicker("getDate");
      if (startDate && date < startDate) {
        return [false, ""];
      }
      return [true, ""];
    }
  });

  // Set the default date for the Return Date datepicker to tomorrow
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var formattedTomorrow = $.datepicker.formatDate("dd-mm-yy", tomorrow);
  returnDatePicker.datepicker("setDate", formattedTomorrow);

  // Function to update the input value
  function updateReturnDateValue(date) {
    $("#end-date2").val(date);
  }
});
$(document).ready(function() {
  var today = new Date();
  var tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  var $startDate = $("#new-start-date");
  var $endDate = $("#new-end-date");

  $startDate.datepicker({
      minDate: 0,
      numberOfMonths: 2,
      showButtonPanel: false,
      onSelect: function(selectedDate) {
          $endDate.datepicker("option", "minDate", selectedDate);
          updateDayCount();
      },
      onClose: function() {
          $endDate.datepicker('show');
      }
  });

  $endDate.datepicker({
      minDate: 0,
      numberOfMonths: 2,
      showButtonPanel: false,
      onSelect: function(selectedDate) {
          $startDate.datepicker("option", "maxDate", selectedDate);
          updateDayCount();
      },
      beforeShow: function(input, inst) {
          inst.dpDiv.find('.ui-datepicker-current-day a').addClass('ui-state-active');
      }
  });

  // Set default dates
  $startDate.datepicker("setDate", today);
  $endDate.datepicker("setDate", tomorrow);

  // Highlight selected date range
  function highlightDate(date) {
      var startDate = $startDate.datepicker("getDate");
      var endDate = $endDate.datepicker("getDate");

      if (
          (startDate && date.getTime() === startDate.getTime()) ||
          (endDate && date.getTime() === endDate.getTime())
      ) {
          return [true, "ui-state-active " + (date.getTime() === startDate.getTime() ? "start" : "end"), ""];
      } else if (
          startDate &&
          endDate &&
          date > startDate &&
          date < endDate
      ) {
          return [true, "sejour", ""];
      }

      return [true, "", ""];
  }

  $startDate.datepicker("option", "beforeShowDay", highlightDate);
  $endDate.datepicker("option", "beforeShowDay", highlightDate);

  // Function to update the day count and display it in the UI
  function updateDayCount() {
      var startDate = $startDate.datepicker("getDate");
      var endDate = $endDate.datepicker("getDate");

      if (startDate && endDate) {
          var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
          var dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

          var dayCountText = 'Selected Days: ' + dayCount;

          $endDate.datepicker('widget').find('.day-count').remove();
          $endDate.datepicker('widget').append('<div class="day-count">' + dayCountText + '</div>');
      }
  }
});



// add and remove flights
$(document).ready(function(){

    // Initialize nextindex with 3 to start from Flight 3
    var nextindex = 3;
    var maxFlights = 5;

    // Add new element
    $(".add").click(function(){

        // Finding total number of elements added
        var total_element = $(".element").length;

        // Check if the total elements reach the maximum
        if (total_element < maxFlights) {
            // Adding new div container after the last occurrence of the element class
            $(".element:last").after("<div class='element' id='div_"+ nextindex +"'></div>");

            var dynaicFlight = "";
            dynaicFlight += '<div class="single-city-data">';
            dynaicFlight += '<h4><img  id="remove_'+ nextindex + '" class="remove" src="image/search/close.svg" alt="">Flight ' + nextindex + '</h4>';
            dynaicFlight += `<form action="">
                <div class="from-to-city">
                    <div class="from-city-name form-input mb-1">
                        <input type="text" placeholder="Choose a travel destination">
                        <label for="">From</label>
                    </div>
                    <div class="switch-city-opt">
                        <img src="image/search/city-switch.svg" alt="">
                    </div>
                    <div class="to-city-name form-input">
                        <input type="text" placeholder="Choose destination">
                        <label for="">To</label>
                    </div>
                </div>
                <div class="departure-date">
                        <input type="text" name="start-date" id="start-date" placeholder="Departure Date" />
                        <label for=""><img src="image/search/calender.svg" alt=""></label>
                </div>
            </form>
            </div>`;

            // Adding the element to <div>
            $("#div_" + nextindex).append(dynaicFlight);

            // Increment nextindex for the next iteration
            nextindex += 1;

            // Check if the total elements reach the maximum, hide the add button
            if (total_element + 1 === maxFlights) {
                $(".add").hide();
            }
        }
    });

    // Remove element
    $('.container').on('click','.remove',function(){

        var id = this.id;
        var split_id = id.split("_");
        var deleteindex = split_id[1];

        // Remove <div> with id
        $("#div_" + deleteindex).remove();

        // Show the add button when an element is removed
        $(".add").show();
    });
});


$(function () {
	// Initialize the datepicker
	$("#datepicker").datepicker();

	// Trigger datepicker when clicking on the label
	$("label[for='datepicker']").on("click", function () {
		$("#datepicker").datepicker("show");
	});
});

$(function () {
	// Initialize the datepickers
	$("#start-date1, #end-date2").datepicker();

	// Trigger datepicker when clicking on the labels
	$("label[for='start-date1'], label[for='end-date2']").on("click", function () {
		var inputId = $(this).attr("for");
		$("#" + inputId).datepicker("show");
	});
});

$(function () {
	// Initialize the datepickers
	$("#datepicker1, #datepicker2").datepicker();

	// Trigger datepicker when clicking on the labels
	$("label[for='datepicker1'], label[for='datepicker2']").on("click", function () {
		var inputId = $(this).attr("for");
		$("#" + inputId).datepicker("show");
	});
});



//  feature-hotel swiper
var swiper = new Swiper(".mySwiper", {
	slidesPerView: 3,
	spaceBetween: 30,
	pagination: false,
	navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
	  autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
	  breakpoints: {
		321:{
			slidesPerView: 1,
		  spaceBetween: 10,
		},
		475:{
			slidesPerView: 2,
		  spaceBetween: 5,
		},
		640: {
		  slidesPerView: 2,
		  spaceBetween: 20,
		},
		768: {
		  slidesPerView: 2,
		  spaceBetween: 40,
		},
		1024: {
		  slidesPerView: 3,
		  spaceBetween: 50,
		},
	  },
  });


//   back to top
$(function(){

	//Scroll event
	$(window).scroll(function(){
	  var scrolled = $(window).scrollTop();
	  if (scrolled > 200) {
          $('.go-top').fadeIn('slow');
      }
	  if (scrolled < 200) {
          $('.go-top').fadeOut('slow');
      }
	});

	//Click event
	$('.go-top').click(function () {
	  $("html, body").animate({ scrollTop: "0" },  80);
	});

  });


//   dummy country code

$(".mobile_code").intlTelInput({
  initialCountry: "in",
  separateDialCode: true,
  // utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.4/js/utils.js"
});


// show pass

function password_show_hide() {
	var x = document.getElementById("floatingPassword");
	var show_eye = document.getElementById("show_eye");
	var hide_eye = document.getElementById("hide_eye");
	hide_eye.classList.remove("d-none");
	if (x.type === "password") {
	  x.type = "text";
	  show_eye.style.display = "none";
	  hide_eye.style.display = "block";
	} else {
	  x.type = "password";
	  show_eye.style.display = "block";
	  hide_eye.style.display = "none";
	}
  }


//   show forgot pass popup

$(".reset-pass").click(function(){
	setTimeout(function(){
		$('#exampleModalToggle4').modal('hide');
		$('#exampleModalToggle5').modal('show');
	  }, 5000);
  });


//   OTP inputs
console.clear();
let inputs = document.querySelectorAll(".otp-inputs input");
let values = Array(4);
let clipData;
inputs[0].focus();

inputs.forEach((tag, index) => {
  tag.addEventListener('keyup', (event) => {
    if(event.code === "Backspace" && hasNoValue(index)) {
      if (index > 0) {
          inputs[index - 1].focus();
      }
    }

    //else if any input move focus to next or out
    else if (tag.value !== "") {
      (index < inputs.length - 1) ? inputs[index + 1].focus() : tag.blur();
    }

    //add val to array to track prev vals
    values[index] = event.target.value;
  });

  tag.addEventListener('input', () => {
    //replace digit if already exists
    if(tag.value > 10) {
      tag.value = tag.value % 10;
    }
  });

  tag.addEventListener('paste', (event) => {
    event.preventDefault();
    clipData = event.clipboardData.getData("text/plain").split('');
    filldata(index);
  })
});

function filldata(index) {
  for(let i = index; i < inputs.length; i += 1) {
    inputs[i].value = clipData.shift();
  }
}

function hasNoValue(index) {
  if (values[index] || values[index] === 0) {
      return false;
  }

  return true;
}


// airline slider

var swiper = new Swiper(".airline-slider", {
	slidesPerView: 7,
	spaceBetween: 9,
	navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
	  autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
	  breakpoints: {
		321:{
			slidesPerView: 3,
		  spaceBetween: 5,
		},
		640: {
		  slidesPerView: 4,
		  spaceBetween: 20,
		},
		768: {
		  slidesPerView: 6,
		  spaceBetween: 10,
		},
		1024: {
		  slidesPerView: 6,
		  spaceBetween: 6,
		},
		1080: {
		  slidesPerView: 7,
		  spaceBetween: 9,
		},
	  },
  });


//   pricing calender

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const datesContainer = document.querySelector('.scrollable-dates');

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
const daysInPreviousMonth = new Date(currentYear, currentMonth, 0).getDate();

// Prices corresponding to each date (example)
const prices = Array.from({ length: daysInCurrentMonth }, (_, index) => (index + 1) * 10);

// Generate date options for previous month
for (let day = daysInPreviousMonth - firstDayOfMonth + 1; day <= daysInPreviousMonth; day += 1) {
    const date = new Date(currentYear, currentMonth - 1, day);
    generateDateOption(date, null);
}

// Generate date options for current month
for (let day = 1; day <= daysInCurrentMonth; day += 1) {
    const date = new Date(currentYear, currentMonth, day);
    generateDateOption(date, prices[day - 1]); // Pass the corresponding price
}

// Generate date options for next month
for (let day = 1; day <= 6 - new Date(currentYear, currentMonth + 1, 1).getDay(); day += 1) {
    const date = new Date(currentYear, currentMonth + 1, day);
    generateDateOption(date, null);
}

function generateDateOption(date, price) {
    const monthName = months[date.getMonth()];
    const dayName = daysOfWeek[date.getDay()];
    const formattedDate = date.getDate();

    const dateOption = document.createElement('div');
    dateOption.classList.add('date-option');

    const daySpan = document.createElement('span');
    daySpan.classList.add('day-name');
    daySpan.textContent = `${monthName}, ${dayName}`;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('date');
    dateSpan.textContent = formattedDate;

    const priceSpan = document.createElement('span');
    priceSpan.classList.add('price');
    priceSpan.textContent = price ? `SAR ${price}` : 'N/A';

    dateOption.appendChild(daySpan);
    dateOption.appendChild(dateSpan);
    dateOption.appendChild(priceSpan);

    // Check if the current date matches the generated date
    if (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
    ) {
        dateOption.classList.add('selected');
    }

    dateOption.addEventListener('click', () => {
        const allDateOptions = document.querySelectorAll('.date-option');
        allDateOptions.forEach(option => {
            option.classList.remove('selected');
        });

        dateOption.classList.add('selected');
    });

    datesContainer.appendChild(dateOption);
}



//   colleps-text
// Wait for the DOM to be fully loaded
$(document).ready(function() {
   // Get the element with class .btn
   const btn = $('.pricing-calender .btn');

   // Toggle the 'collapsed' class and change text accordingly
   btn.click(function() {
     btn.toggleClass('collapsed');
     if (btn.hasClass('collapsed')) {
       btn.html('<i class="fa-solid fa-calendar-days"></i> Show Pricing Calendar');
     } else {
       btn.html('<i class="fa-solid fa-calendar-days"></i> Hide Pricing Calendar');
     }
   });
 });

//   modify-search-visible
// Wait for the DOM to be fully loaded
$(document).ready(function () {
	// Add click event listener to the modify-serch-edit-btn
	$('.modify-serch-edit-btn').on('click', function () {
		// Toggle the active-visible class on the search-flight-dtls element
		$('.search-flight-dtls').toggleClass('active-visible');
	});
});


// mobile-filter
$(".filter-btn").click(function(){
	$(".mobile-filters-ls").toggleClass("visible-content");
  });


// mobile-flight search result
$(".show-more-dtls").click(function(){
  $(".mob-flight-result-data").toggleClass("visible-content");
});

$(document).ready(function () {
  // Function to remove href attribute for screens smaller than or equal to 991px
  function removeHrefOnSmallScreens() {
      if ($(window).width() <= 991) {
          $('.show-more-dtls').removeAttr('href');
      } else {
          // If screen size is greater than 991px, restore href attributes
          $('.show-more-dtls').each(function () {
              if ($(this).data('original-href')) {
                  $(this).attr('href', $(this).data('original-href'));
              }
          });
      }
  }

  // Initial call to the function
  removeHrefOnSmallScreens();

  // Call the function whenever the window is resized
  $(window).resize(function () {
      removeHrefOnSmallScreens();
  });
});


// hotel tabs details

function changeTab(tabId) {
    // Remove the 'active' class from all tabs
    const tabs = document.querySelectorAll('.hotels-details-tabs li');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Add the 'active' class to the clicked tab
    const clickedTab = document.querySelector(`.hotels-details-tabs li[onclick="changeTab('${tabId}')"`);
    clickedTab.classList.add('active');

    // Get the target div
    const targetDiv = document.getElementById(tabId);

    // Calculate the target scroll position
    const targetPosition = targetDiv.offsetTop - 80;

    // Scroll to the calculated position
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}

// Use Intersection Observer to handle scroll-based activation
const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			// Remove the 'active' class from all tabs
			const tabs = document.querySelectorAll('.hotels-details-tabs li');
			tabs.forEach(tab => tab.classList.remove('active'));

			// Add the 'active' class to the corresponding tab
			const correspondingTab = document.querySelector(`.hotels-details-tabs li[onclick="changeTab('${entry.target.id}')"`);
			correspondingTab.classList.add('active');
		}
	});
}, { threshold: 0.5 });

// Observe each tab content div
const tabDivs = document.querySelectorAll('.tabs-inner-main-data > div');
tabDivs.forEach(div => observer.observe(div));


// room select button
function selectRoom(clickedButton) {
	// Remove the "selected" state from all buttons
	const allButtons = document.querySelectorAll('.room-button');
	allButtons.forEach(button => {
		button.classList.remove('selected');
		button.classList.remove('btn-success'); // Remove Bootstrap success class
		button.classList.add('btn-primary');  // Add Bootstrap primary class
		button.innerHTML = 'Select Room';
	});

	// Set the "selected" state for the clicked button
	clickedButton.classList.add('selected');
	clickedButton.classList.remove('btn-primary'); // Remove Bootstrap primary class
	clickedButton.classList.add('btn-success');  // Add Bootstrap success class
	clickedButton.innerHTML = 'Selected <i class="fas fa-check"></i>';
}
// top-right

  // Get references to the div and the close button

// slider

// $('#slider').slider({
//   range: true,
//   min: 0,
//   max: 20000,
//   values: [ 0, 20000 ],
//   slide: function(event, ui) {
  
//   $('.ui-slider-handle:eq(0) .price-range-min').html('₹' + ui.values[ 0 ]);
//   $('.ui-slider-handle:eq(1) .price-range-max').html('₹' + ui.values[ 1 ]);
//   $('.price-range-both').html('<i>₹' + ui.values[ 0 ] + ' - </i>₹' + ui.values[ 1 ] );
  
  
  
//   if ( ui.values[0] == ui.values[1] ) {
//     $('.price-range-both i').css('display', 'none');
//   } else {
//     $('.price-range-both i').css('display', 'block');
//   }
      
      
  
//   if (collision($('.price-range-min'), $('.price-range-max')) == true) {
//     $('.price-range-min, .price-range-max').css('opacity', '0');	
//     $('.price-range-both').css('display', 'block');		
//   } else {
//     $('.price-range-min, .price-range-max').css('opacity', '1');	
//     $('.price-range-both').css('display', 'none');		
//   }
  
//   }
//   });
  
//   $('.ui-slider-range').append('<span class="price-range-both value"><i>₹' + $('#slider').slider('values', 0 ) + ' - </i>' + $('#slider').slider('values', 1 ) + '</span>');
  
//   $('.ui-slider-handle:eq(0)').append('<span class="price-range-min value">₹' + $('#slider').slider('values', 0 ) + '</span>');
  
//   $('.ui-slider-handle:eq(1)').append('<span class="price-range-max value">₹' + $('#slider').slider('values', 1 ) + '</span>');

// $(document).ready(function() {
//   $('#slider').slider({
//       range: true,
//       min: 0,
//       max: 20000,
//       values: [0, 20000],
//       slide: function(event, ui) {
//           $('.price-range-min').html('₹' + ui.values[0]);
//           $('.price-range-max').html('₹' + ui.values[1]);

//           if (ui.values[0] == ui.values[1]) {
//               $('.price-range-max').css('display', 'none');
//           } else {
//               $('.price-range-max').css('display', 'block');
//           }

//           if (collision($('.price-range-min'), $('.price-range-max'))) {
//               $('.price-range-min, .price-range-max').css('opacity', '0');
//           } else {
//               $('.price-range-min, .price-range-max').css('opacity', '1');
//           }
//       }
//   });

//   // Initialize values on load
//   $('.price-range-min').html('₹' + $('#slider').slider('values', 0));
//   $('.price-range-max').html('₹' + $('#slider').slider('values', 1));

//   // Append indicator elements
//   $('.price-range-indicator .price-range-min').html('₹' + $('#slider').slider('values', 0));
//   $('.price-range-indicator .price-range-max').html('₹' + $('#slider').slider('values', 1));
// });

// // Function to check collision
// function collision($min, $max) {
//   return $min.position().left < $max.position().left;
// }




// $('#slider').slider({
//   range: true,
//   min: 0,
//   max: 20000,
//   values: [ 0, 20000 ],
//   slide: function(event, ui) {
  
//   $('.ui-slider-handle:eq(0) .price-range-min').html('₹' + ui.values[ 0 ]);
//   $('.ui-slider-handle:eq(1) .price-range-max').html('₹' + ui.values[ 1 ]);
//   $('.price-range-both').html('<i>₹' + ui.values[ 0 ] + ' - </i>₹' + ui.values[ 1 ] );
  
  
  
//   if ( ui.values[0] == ui.values[1] ) {
//     $('.price-range-both i').css('display', 'none');
//   } else {
//     $('.price-range-both i').css('display', 'inline');
//   }
      
      
  
//   if (collision($('.price-range-min'), $('.price-range-max')) == true) {
//     $('.price-range-min, .price-range-max').css('opacity', '0');	
//     $('.price-range-both').css('display', 'block');		
//   } else {
//     $('.price-range-min, .price-range-max').css('opacity', '1');	
//     $('.price-range-both').css('display', 'none');		
//   }
  
//   }
//   });
  
//   $('.ui-slider-range').append('<span class="price-range-both value"><i>₹' + $('#slider').slider('values', 0 ) + ' - </i>' + $('#slider').slider('values', 1 ) + '</span>');
  
//   $('.ui-slider-handle:eq(0)').append('<span class="price-range-min value">₹' + $('#slider').slider('values', 0 ) + '</span>');
  
//   $('.ui-slider-handle:eq(1)').append('<span class="price-range-max value">₹' + $('#slider').slider('values', 1 ) + '</span>');
$(document).ready(function() {
  // Set initial values
  var initialValue1 = 0;
  var initialValue2 = 20000;

  $('#slider').slider({
    range: true,
    min: 0,
    max: 20000,
    values: [initialValue1, initialValue2],
    slide: function(event, ui) {
      $('.price-range-min').html('₹' + ui.values[0]);
      $('.price-range-max').html('₹' + ui.values[1]);

      // Check if handles are closest
      var isHandlesClose = Math.abs(ui.values[0] - ui.values[1]) < 100;

      if (isHandlesClose) {
        // Set values as static text
        $('.price-range-min').html('Min: ₹' + initialValue1);
        $('.price-range-max').html('Max: ₹' + initialValue2);
      } else {
        // Update values normally
        $('.price-range-min').html('₹' + ui.values[0]);
        $('.price-range-max').html('₹' + ui.values[1]);
      }

      // Update the position of displayed values
      updateValuePosition();
    }
  });

  // Initialize values on load
  $('.price-range-min').html('₹' + initialValue1);
  $('.price-range-max').html('₹' + initialValue2);

  // Append indicator elements
  $('.ui-slider-handle:eq(0)').append('<div class="price-range-min value">₹' + initialValue1 + '</div>');
  $('.ui-slider-handle:eq(1)').append('<div class="price-range-max value">₹' + initialValue2 + '</div>');

  // Update the position of displayed values on page load
  updateValuePosition();
});

function collision($min, $max) {
  return $min.position().left < $max.position().left;
}

// Function to update the position of the displayed values
function updateValuePosition() {
  var handle1 = $('.ui-slider-handle:eq(0)');
  var handle2 = $('.ui-slider-handle:eq(1)');

  var handle1Pos = handle1.offset().left + handle1.outerWidth() / 2;
  var handle2Pos = handle2.offset().left + handle2.outerWidth() / 2;

  // Calculate the vertical offset based on the distance between handles
  var verticalOffset = Math.abs(handle1Pos - handle2Pos) < 50 ? 30 : 0;

  $('.price-range-min').offset({ left: handle1Pos - $('.price-range-min').outerWidth() / 2, top: handle1.offset().top + handle1.outerHeight() + verticalOffset });
  $('.price-range-max').offset({ left: handle2Pos - $('.price-range-max').outerWidth() / 2, top: handle2.offset().top + handle2.outerHeight() + verticalOffset });
}


// $(document).ready(function() {
//   $('#slider').slider({
//       range: true,
//       min: 0,
//       max: 20000,
//       values: [0, 20000],
//       slide: function(event, ui) {
//           $('.price-range-min').html('₹' + ui.values[0]);
//           $('.price-range-max').html('₹' + ui.values[1]);

//           if (ui.values[0] == ui.values[1]) {
//               $('.price-range-max').css('display', 'none');
//           } else {
//               $('.price-range-max').css('display', 'inline');
//           }

//           if (collision($('.price-range-min'), $('.price-range-max'))) {
//               $('.price-range-min, .price-range-max').css('opacity', '0');
//           } else {
//               $('.price-range-min, .price-range-max').css('opacity', '1');
//           }

//           // Update the position of displayed values
//           updateValuePosition();
//       }
//   });

//   // Initialize values on load
//   $('.price-range-min').html('₹' + $('#slider').slider('values', 0));
//   $('.price-range-max').html('₹' + $('#slider').slider('values', 1));

//   // Append indicator elements
//   $('.ui-slider-handle:eq(0)').append('<div class="price-range-min value">₹' + $('#slider').slider('values', 0) + '</div>');
//   $('.ui-slider-handle:eq(1)').append('<div class="price-range-max value">₹' + $('#slider').slider('values', 1) + '</div>');

//   // Update the position of displayed values on page load
//   updateValuePosition();
// });

// function collision($min, $max) {
//   return $min.position().left < $max.position().left;
// }

// // Function to update the position of the displayed values
// function updateValuePosition() {
//   var handle1 = $('.ui-slider-handle:eq(0)');
//   var handle2 = $('.ui-slider-handle:eq(1)');

//   var minValue = $('#slider').slider('values', 0);
//   var maxValue = $('#slider').slider('values', 1);

//   $('.price-range-min').html('₹' + minValue);
//   $('.price-range-max').html('₹' + maxValue);

//   var handle1Pos = handle1.offset().left + handle1.outerWidth() / 2;
//   var handle2Pos = handle2.offset().left + handle2.outerWidth() / 2;

//   $('.price-range-min').offset({ left: handle1Pos - $('.price-range-min').outerWidth() / 2, top: handle1.offset().top + handle1.outerHeight() + 5 });
//   $('.price-range-max').offset({ left: handle2Pos - $('.price-range-max').outerWidth() / 2, top: handle2.offset().top + handle2.outerHeight() + 5 });
// }

var slider = document.getElementById("myRange");
var output = document.getElementById("displayValue");
var hours = Math.floor(slider.value / 60);
var minutes = slider.value % 60;
var minuteOutput = $("#minutes")[0];
var hourOutput = $("#hours")[0];
var hours = Math.floor(slider.value / 60);
var minutes = slider.value % 60;
hourOutput.innerHTML = hours + 'h';
minuteOutput.innerHTML = minutes + 'm';

$('.slider').change(function() {
				var hours = Math.floor(slider.value / 60);
        var minutes = slider.value % 60;
        hourOutput.innerHTML = hours + 'h';
        minuteOutput.innerHTML = minutes + 'm'
});
  

