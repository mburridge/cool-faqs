<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>
<?php 

$args = array(
  'post_type' 		=> 'cool-faqs',
  'posts_per_page'	=> '-1',
  'order' => 'ASC',
  'orderby' => 'ID'
); // see https://developer.wordpress.org/reference/classes/wp_query/ for possible arguments

// check for category and add to query arguments ($args)
if ( $attributes['category'] ) {
  $args[ 'tax_query' ] = array(
    array(
      'taxonomy' => 'cool-faqs-cat',
      'field'    => 'id',
      'terms'    => $attributes[ 'category' ]
    )
  );
}

$faqs = new WP_Query( $args );

$faq_styles = "--question-text-color: " . $attributes["questionTextColor"] . ";";

$show_faqs = '<div ' . get_block_wrapper_attributes( array( "style" =>  $faq_styles  ) ) . '>';

if ( $faqs->have_posts() ) {
  
  while ( $faqs->have_posts() ) {
    $show_faqs .= '<details>';
    $faqs->the_post();
    $show_faqs .= '<summary>' . get_the_title() . '</summary>';
    $show_faqs .= '<div class="faq-content">' . get_the_content() . '</div>';
    $show_faqs .= '</details>';
  }
  
}  else {
  $show_faqs .= "No FAQs found.";
}

$show_faqs .= '</div>';

wp_reset_postdata();
echo $show_faqs;

?>