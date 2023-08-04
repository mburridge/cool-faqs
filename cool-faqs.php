<?php
/**
 * Plugin Name:       Cool Faqs
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cool-faqs
 *
 * @package           create-block
 */

 defined( 'ABSPATH' ) or die( "Nothing to see here!" );

// Register custom post type 'cool-faqs'
function cool_faqs_create_post_type() {

 	// define labels
	$labels = array (
		'name' 				    => __( 'FAQs','post type general name', 'cool-faqs' ),
		'singular_name' 	=> __( 'FAQ', 'post type singular name', 'cool-faqs' ),
		'name_admin_bar'	=> __( 'FAQs', 'cool-faqs' ),
		'add_new' 			  => __( 'Add new FAQ', 'cool-faqs' ),
		'add_new_item' 		=> __( 'Add new FAQ', 'cool-faqs' ),
		'edit_item' 		  => __( 'Edit FAQ', 'cool-faqs' ),
		'new_item' 			  => __( 'New FAQ', 'cool-faqs' ),
		'view_item' 		  => __( 'View FAQ', 'cool-faqs' )
	);

	// define args
	$args = array (
		'labels' 				    => $labels,
    'description'		    => 'Holds questions and answers for FAQs',
		'public' 				    => true,
		'show_in_nav_menus' => false,
		'menu_icon' 			  => 'dashicons-list-view',
		'supports' 				  => array( 'title', 'editor', 'page-attributes', 'revisions', 'thumbnail' ),
		'show_in_rest' 			=> true
	);

	register_post_type( 'cool-faqs', $args );

}
add_action( 'init', 'cool_faqs_create_post_type' );

// Register custom taxonomy 'wceu_faq_cat'
function cool_faqs_create_taxonomies() {

	 //define labels
	 $labels = array(
		  'name' 					        => __( 'FAQ Categories', 'taxonomy general name', 'cool-faqs' ),
		  'singular_name' 			  => __( 'FAQ Category', 'taxonomy singular name', 'cool-faqs' ),
		  'search_items' 			    => __( 'Search Categories', 'cool-faqs' ),
		  'all_items' 				    => __( 'All Categories', 'cool-faqs' ),
		  'edit_item'  				    => __( 'Edit Category', 'cool-faqs' ),
		  'update_item' 			    => __( 'Update Category', 'cool-faqs' ),
		  'add_new_item' 			    => __( 'Add New Category', 'cool-faqs' ),
		  'new_item_name' 			  => __( 'New Category', 'cool-faqs' ),
		  'popular_items' 			  => __( 'Popular Categories', 'cool-faqs' ),
		  'menu_name' 				    => __( 'Categories', 'cool-faqs' ),
		  'choose_from_most_used'	=> __( 'Choose from the most used Categories', 'cool-faqs' ),
		  'not_found' 				    => __( 'No Categories found', 'cool-faqs' )
	 );

	 // define args
	 $args = array(
		  'hierarchical' 		  => false,
		  'labels' 				    => $labels,
		  'rewrite' 			    => true,
		  'show_admin_column'	=> true,
		  'show_in_rest' 		  => true,
	);

	register_taxonomy( 'cool-faqs-cat', 'cool-faqs', $args );

}
add_action( 'init', 'cool_faqs_create_taxonomies' );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_cool_faqs_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_cool_faqs_block_init' );
