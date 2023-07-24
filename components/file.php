<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$attributes = $component->getAttributes();

$value = (string) $component->value;
if (isset($attributes['value'])) {
    unset($attributes['value']);
}

$valueText = (string) $component->valueText;
if (isset($attributes['valuetext'])) {
    unset($attributes['valuetext']);
}

$name = (string) $component->name;
if (isset($attributes['name'])) {
    unset($attributes['name']);
}

$multiple = (string)$component->multiple === 'true' || (string)$component->multiple === 'multiple';

$elementID = 'fe' . md5(uniqid());
$attributes['data-form-element-component'] = 'button';

$chooseText = __('ivopetkov.form-element.file.Choose');

echo '<html><head>';
echo '<style>'
    . Utilities::getDefaultStyles()
    . '[data-form-element-type="file"] [data-form-element-component="button"]{cursor:pointer;overflow:hidden;display:inline-block;position:relative;}' // needed for the absolute positioned clear button
    . '[data-form-element-type="file"] [data-form-element-component="text"]{display:block;width:100%;height:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:inherit;box-sizing:border-box;padding-right:42px;}'
    . '[data-form-element-type="file"] [data-form-element-component="clear-button"]{cursor:pointer;position:absolute;right:0;top:0;width:42px;height:42px;overflow:hidden;user-select:none;-moz-user-select:none;-webkit-user-select:none;}'
    . '[data-form-element-type="file"] input{display:none;}'
    . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('file', $attributes) . '>';
$labelElement = Utilities::getLabelElement($attributes);
if ($labelElement !== '') {
    echo '<label for="' . htmlentities($elementID) . '">';
    echo $labelElement;
    echo '</label>';
}
echo Utilities::getHintElement($attributes);
echo '<label for="' . htmlentities($elementID) . '" ' . Utilities::getElementAttributes($attributes) . '">';
echo '<span data-form-element-component="text">' . htmlspecialchars(strlen($value) > 0 ? (strlen($valueText) === 0 ? $value : $valueText) : $chooseText) . '</span>';
echo '<span data-form-element-component="clear-button" style="display:' . (strlen($value) > 0 ? 'inline-block' : 'none') . ';"></span>';
echo '</label>';
echo '<input name="' . htmlentities($name) . '" data-value="' . htmlentities($value) . '" id="' . htmlentities($elementID) . '" type="file"' . ($multiple ? ' multiple' : '') . '/>';
echo Utilities::getHintAfterElement($attributes);
//$js = file_get_contents(__DIR__ . '/../dev/api.file.js');
$js = include __DIR__ . '/file.api.min.js.php';
$js = str_replace('CHOOSE_TEXT_TO_REPLACE', $chooseText, $js);
$js = str_replace('SELECTED_FILES_COUNT_TEXT_TO_REPLACE', __('ivopetkov.form-element.file.SelectedFilesCount'), $js);
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
