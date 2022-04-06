<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;
use IvoPetkov\HTML5DOMDocument;

$attributes = $component->getAttributes();
$optionsHTML = $component->innerHTML;
$dom = new HTML5DOMDocument();
$dom->loadHTML('<body>' . $optionsHTML . '</body>');
$options = $dom->querySelectorAll('option');
$elementName = '';
if (isset($attributes['name'])) {
    $elementName = (string)$attributes['name'];
    unset($attributes['name']);
}
$value = '';
if (isset($attributes['value'])) {
    $value = (string)$attributes['value'];
    unset($attributes['value']);
}
$group = 'ferl' . (strlen($elementName) > 0 ? md5($elementName) : md5($component->outerHTML));
$optionsValues = [];
foreach ($options as $option) {
    $optionValue = $option->getAttribute('value');
    if ($optionValue !== null) {
        $optionsValues[] = $optionValue;
    }
}

echo '<html><head>';
echo '<style>' . Utilities::getDefaultStyles() . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('checkbox-list', $attributes) . ' ' . Utilities::getElementAttributes($attributes) . '>';
echo '<input type="hidden" name="' . htmlentities($elementName) . '" value="' . htmlentities($value) . '">';
echo Utilities::getLabelElement($attributes);
echo Utilities::getHintElement($attributes);
echo '<div data-form-element-component="checkbox-list-options>';
foreach ($options as $option) {
    $optionType = $option->getAttribute('type');
    $optionValue = $option->getAttribute('value');
    if ($optionType === 'textbox') {
        $isChecked = $value !== '' && array_search($value, $optionsValues) === false;
        $textInputHTML = '<input type="text"' . ($isChecked ? ' value="' . htmlentities($value) . '"' : '') . ' data-form-element-component="checkbox-list-option-textbox" placeholder="' . htmlentities((string)$option->getAttribute('placeholder')) . '">';
        $textAttribute = ' form-elements-internal-label-html="' . htmlentities($textInputHTML) . '"';
    } else {
        $textAttribute = ' labelHTML="' . htmlentities($option->innerHTML) . '"';
        $isChecked = $optionValue !== null && $optionValue === $value;
    }
    $checkedAttribute = $isChecked ? ' checked="checked"' : '';
    echo '<form-element-checkbox name="' . htmlentities($group) . '"' . $checkedAttribute . $textAttribute . ' value="' . htmlentities($option->getAttribute('value')) . '" form-elements-internal-attribute-type="" form-elements-internal-container-attribute="' . htmlentities('data-form-element-component="checkbox-list-option"') . '" form-elements-internal-attribute-input="checkbox-list-option-input" form-elements-internal-attribute-label="checkbox-list-option-label"/>';
}
echo '</div>';
//$js = file_get_contents(__DIR__ . '/../dev/api.checkbox-list.js');
$js = include __DIR__ . '/checkbox-list.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
