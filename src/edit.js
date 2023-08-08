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
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { useEntityRecords } from '@wordpress/core-data';
import { Spinner, PanelBody, SelectControl } from '@wordpress/components';

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

export default function Edit( { attributes, setAttributes } ) {
	const { category, questionTextColor, questionBackgroundColor } = attributes;

	const faqStyles = {
		'--question-text-color': questionTextColor,
		'--question-background-color': questionBackgroundColor,
	};

	const query = { order: 'asc', orderby: 'id' }; // see https://developer.wordpress.org/rest-api/reference/posts/ for possible arguments
	if ( category ) {
		query[ 'cool-faqs-cat' ] = category;
	}
	const faqs = useEntityRecords( 'postType', 'cool-faqs', query );

	const cats = useEntityRecords( 'taxonomy', 'cool-faqs-cat' );
	const options =
		cats.records &&
		cats.records.map( ( cat ) => {
			return {
				label: cat.name,
				value: cat.id,
			};
		} );

	// onChange functions
	const onChangeCat = ( val ) => setAttributes( { category: Number( val ) } );
	const onChangeQuestionTextColor = ( val ) =>
		setAttributes( { questionTextColor: val } );
	const onChangeQuestionBackgroundColor = ( val ) =>
		setAttributes( { questionBackgroundColor: val } );

	return (
		<div { ...useBlockProps( { style: faqStyles } ) }>
			<InspectorControls>
				<PanelBody>
					{ cats.hasResolved && (
						<SelectControl
							label={ 'Category' }
							onChange={ onChangeCat }
							value={ category }
							options={ [
								{
									label: 'All',
									value: 0,
								},
								...options,
							] }
						/>
					) }
				</PanelBody>
				<PanelColorSettings
					title="Question colours"
					colorSettings={ [
						{
							label: 'Text',
							value: questionTextColor,
							onChange: onChangeQuestionTextColor,
						},
						{
							label: 'Background',
							value: questionBackgroundColor,
							onChange: onChangeQuestionBackgroundColor,
						},
					] }
				></PanelColorSettings>
			</InspectorControls>
			<FaqList hasResolved={ faqs.hasResolved } faqs={ faqs.records } />
		</div>
	);
}
