<?php

/*
Plugin Name: ACF OpenStreetMap Field
Plugin URI: https://github.com/ffoodd/acf-field-openstreetmap
Description: Adds a configrable OpenStreetMap Field to ACF.
Author: Jörn Lund + Gaël Poupard (fork)
Version: 0.1.9
Author URI: https://github.com/ffoodd
License: GPL3
Github Repository: ffoodd/acf-field-openstreetmap
GitHub Plugin URI: ffoodd/acf-field-openstreetmap
Release Asset: false
Text Domain: acf-field-openstreetmap
Domain Path: /languages/
*/

/*  Copyright 2018  Jörn Lund

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

namespace ACFFieldOpenstreetmap;

if ( ! defined('ABSPATH') ) {
	die('FU!');
}


define( 'ACF_FIELD_OPENSTREETMAP_FILE', __FILE__ );
define( 'ACF_FIELD_OPENSTREETMAP_DIRECTORY', plugin_dir_path(__FILE__) );
define( 'ACF_FIELD_OPENSTREETMAP_PLUGIN', pathinfo( ACF_FIELD_OPENSTREETMAP_DIRECTORY, PATHINFO_FILENAME ) . '/' . pathinfo( __FILE__, PATHINFO_BASENAME ) );

require_once ACF_FIELD_OPENSTREETMAP_DIRECTORY . 'include/autoload.php';

Core\Core::instance();








if ( is_admin() || defined( 'DOING_AJAX' ) ) {

	// don't WP-Update actual repos!
	if ( ! file_exists( ACF_FIELD_OPENSTREETMAP_DIRECTORY . '/.git/' ) ) {

		// Check if https://github.com/afragen/github-updater is active
		$active_plugins = get_option('active_plugins');

		if ( $sitewide_plugins = get_site_option('active_sitewide_plugins') ) {
			$active_plugins = array_merge( $active_plugins, array_keys( $sitewide_plugins ) );
		}

		if ( ! in_array( 'github-updater/github-updater.php', $active_plugins ) ) {

			AutoUpdate\AutoUpdateGithub::instance()->init( __FILE__ );
		}
	}



	Settings\SettingsOpenStreetMap::instance();

}
