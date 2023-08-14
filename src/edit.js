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
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
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
import NumberControl from './components/number-control';

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

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		category,
		questionTextColor,
		questionBackgroundColor,
		answerTextColor,
		answerBackgroundColor,
		faqMargin,
	} = attributes;

	const faqStyles = {
		'--question-text-color': questionTextColor,
		'--question-background-color': questionBackgroundColor,
		'--answer-text-color': answerTextColor,
		'--answer-background-color': answerBackgroundColor,
		'--faq-margin': `${ faqMargin }px`,
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
	const onChangeAnswerTextColor = ( val ) =>
		setAttributes( { answerTextColor: val } );
	const onChangeAnswerBackgroundColor = ( val ) =>
		setAttributes( { answerBackgroundColor: val } );
	const onChangeFaqMargin = ( val ) =>
		setAttributes( { faqMargin: Number( val ) } );

	const colorSettings = [];
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

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
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody title="FAQ colors" initialOpen={ false }>
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
					<PanelColorSettings
						title="Answer colours"
						colorSettings={ [
							{
								label: 'Text',
								value: answerTextColor,
								onChange: onChangeAnswerTextColor,
							},
							{
								label: 'Background',
								value: answerBackgroundColor,
								onChange: onChangeAnswerBackgroundColor,
							},
						] }
					></PanelColorSettings>
				</PanelBody>
				<PanelBody title="Space between FAQs">
					<NumberControl
						label="Margin"
						value={ faqMargin }
						onChange={ onChangeFaqMargin }
						min={ 0 }
						max={ 500 }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="color">
				{ /*
        see: https://github.com/ndiego/icon-block/pull/35/files
        and: https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/social-links/edit.js
        for more than one, create an array of settings options and map over them
       */ }
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: 'Question colour',
							colorValue: questionTextColor,
							onColorChange: onChangeQuestionTextColor,
							isShownByDefault: true,
							resetAllFilter: () => {
								setAttributes( {
									questionTextColor: undefined,
								} );
							},
						},
					] }
					panelId={ clientId }
					{ ...colorGradientSettings }
				/>
			</InspectorControls>
			<h4>
				Category:
				{ cats.records &&
					cats.records.find( ( cat ) => cat.id === category ).name }
			</h4>
			<FaqList hasResolved={ faqs.hasResolved } faqs={ faqs.records } />
		</div>
	);
}
