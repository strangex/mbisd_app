<?php


return [

	'path' => storage_path()."/app/private/backup",

	'mysql' => [
		'dump_command_path' => '/usr/bin/',
		'restore_command_path' => '/usr/bin/',
	],

	's3' => [
		'path' => ''
	],

    'compress' => false,
];

