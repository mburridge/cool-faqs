/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { useEntityRecords } from '@wordpress/core-data';
import { Spinner } from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

function FaqList( { hasResolved, faqs } ) {
	if ( ! hasResolved ) {
		return <Spinner />;
	}
	if ( ! faqs.length ) {
		return <>No FAQs found.</>;
	}

	return (
		<>
			{ faqs &&
				faqs.map( ( faq ) => {
					return (
						<details key={ faq.id }>
							<summary>{ faq.title.raw }</summary>
							<section
								className="faq-content"
								dangerouslySetInnerHTML={ {
									__html: faq.content.raw,
								} }
							/>
						</details>
					);
				} ) }
		</>
	);
}

export default function Edit() {
	const faqs = useEntityRecords( 'postType', 'cool-faqs' );

	return (
		<div { ...useBlockProps() }>
			<FaqList hasResolved={ faqs.hasResolved } faqs={ faqs.records } />
		</div>
	);
}
