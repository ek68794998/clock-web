$("document").ready(function() {
	var millisInSecond = 1000;
	var now = moment();
	var $container = $("#time-container");

	updateTimes($container, now);
	var updateInterval;

	setTimeout(function() {
		updateTimes($container, moment());

		updateInterval = setInterval(function() {
			updateTimes($container, moment());
		}, millisInSecond);
	}, (millisInSecond - now.milliseconds()));

	$("#theme-checkbox").change(function() {
		setTheme($(this).is(":checked") ? "dark" : "light");
	});

	$("nav.navbar .navbar-nav a").click(function(e) {
		e.preventDefault();

		var path = $(this).attr("href").substr(1);
		var $tab = $("#tab-container > .tab-" + path);

		$("#tab-container > div").hide();
		$tab.show();
	});
});

function setTheme(theme) {
	if (theme != "dark" && theme != "light") {
		throw "Incorrect theme value '" + theme + "'";
	}

	$.cookie("theme", "theme-" + theme);
	$("body").removeClass("dark light").addClass(theme);
}

function updateTimes($container, updatedTime) {
	$container.find(".time").text(updatedTime.format("h:mm:ss a"));
	$container.find(".date").text(updatedTime.format("MMM D YYYY"));
}
