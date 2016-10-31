<?php
	$theme = isset($_COOKIE["theme"]) ? $_COOKIE["theme"] : "theme-light";
?>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700">
	<link href="material-kit/css/bootstrap.min.css" rel="stylesheet" />
	<link href="material-kit/css/material-kit.css" rel="stylesheet" />
	<link href="index.css" rel="stylesheet" />
	<link xmlns="http://www.w3.org/1999/xhtml" rel="shortcut icon" href="favicon.png" />
</head>
<body class="page-home <?php echo $theme == "theme-light" ? "light" : "dark"; ?>">
	<nav class="navbar">
		<div class="container">
			<div class="navbar-brand">Clock</div>
			<ul class="nav navbar-nav navbar-right">
				<li><a href="#clock">Clock</a></li>
				<li><a href="#timer">Timer</a></li>
				<li><a href="#stopwatch">Stopwatch</a></li>
				<li><a href="#settings">Settings</a></li>
			</ul>
		</div>
	</nav>
	<div id="tab-container" class="container">
		<div class="tab-clock">
			<div id="time-container">
				<div class="time">--</div>
				<div class="date">--</div>
			</div>
		</div>
		<div class="tab-settings" style="display: none">
			<fieldset id="controls-container">
				<legend>Settings</legend>
				<div class="togglebutton"><label>Light <input type="checkbox" class="slider-warning" id="theme-checkbox" <?php echo $theme == "theme-light" ? "" : "checked"; ?> /> Dark</label></div>
			</fieldset>
		</div>
	</div>
	<script src="material-kit/js/jquery.min.js" type="text/javascript"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.2/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
	<script src="material-kit/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="material-kit/js/material.min.js" type="text/javascript"></script>
	<script src="material-kit/js/material-kit.js" type="text/javascript"></script>
	<script src="index.js"></script>
</body>
</html>