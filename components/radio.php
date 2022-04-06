<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$attributes = $component->getAttributes();

$elementTypeAttributeValue = $component->getAttribute('form-elements-internal-attribute-type');
if ($elementTypeAttributeValue === null) {
    $elementTypeAttributeValue = 'radio';
}

$elementInputAttributeValue = $component->getAttribute('form-elements-internal-attribute-input');
if ($elementInputAttributeValue === null) {
    $elementInputAttributeValue = 'input';
}

$elementContainerAttributes = $component->getAttribute('form-elements-internal-container-attribute');
if ($elementContainerAttributes !== null) {
    $elementContainerAttributes = ' ' . $elementContainerAttributes;
}

$attributes['data-form-element-component'] = $elementInputAttributeValue;
$attributes['type'] = 'radio';

$labelAttributes = $attributes;
$elementLabelAttributeValue = $component->getAttribute('form-elements-internal-attribute-label');
if ($elementLabelAttributeValue !== null) {
    $labelAttributes['form-elements-internal-component-name'] = $elementLabelAttributeValue;
}

echo '<html><head>';
echo '<style>' . Utilities::getDefaultStyles() . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes($elementTypeAttributeValue, $attributes) . $elementContainerAttributes . '>';
echo '<label>';
echo '<input ' . Utilities::getElementAttributes($attributes) . '/>';
echo Utilities::getLabelElement($labelAttributes);
echo $component->getAttribute('form-elements-internal-label-html');
echo '</label>';
//$js = file_get_contents(__DIR__ . '/../dev/api.radio.js');
$js = include __DIR__ . '/radio.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
