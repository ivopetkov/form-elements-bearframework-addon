<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use BearFramework\App;
use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$app = App::get();

$attributes = $component->getAttributes();

$value = (string) $component->value;
if (isset($attributes['value'])) {
    unset($attributes['value']);
}

$valuePreviewUrl = (string) $component->valuePreviewUrl;
if (isset($attributes['valuepreviewurl'])) {
    unset($attributes['valuepreviewurl']);
}

$name = (string) $component->name;
if (isset($attributes['name'])) {
    unset($attributes['name']);
}

$maxSize = '';
if (isset($attributes['maxsize'])) {
    $maxSize = $attributes['maxsize'];
    unset($attributes['maxsize']);
}

$showClearButton = true;
if (isset($attributes['showclearbutton'])) {
    $showClearButton = $attributes['showclearbutton'] === 'true';
    unset($attributes['showclearbutton']);
}

$elementID = 'fe' . md5(uniqid());
$attributes['data-form-element-component'] = 'button';

$labelStyle = '';
if (strlen($valuePreviewUrl) > 0) {
    $labelStyle = 'background-image:url(' . $valuePreviewUrl . ');';
}

$chooseText = __('ivopetkov.form-element.image.Choose');
$clearButtonTitle = __('ivopetkov.form-element.image.ClearButton');

echo '<html><head>';
echo '<style>'
    . Utilities::getDefaultStyles()
    . '[data-form-element-type="image"] [data-form-element-component="button"]{cursor:pointer;overflow:hidden;display:inline-block;position:relative;background-size:cover;background-position:center;}' // needed for the absolute positioned clear button
    . '[data-form-element-type="image"] [data-form-element-component="text"]{display:block;width:100%;height:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:inherit;box-sizing:border-box;padding-right:42px;}'
    . '[data-form-element-type="image"] [data-form-element-component="clear-button"]{cursor:pointer;position:absolute;right:0;top:0;width:42px;height:42px;overflow:hidden;user-select:none;-moz-user-select:none;-webkit-user-select:none;}'
    . '[data-form-element-type="image"] input{display:none;}'
    . '</style>';

echo '<script>'
    . 'var ivoPetkovBearFrameworkAddonsFormElementsImageGetText=' . $app->localization->getGetTextJsFunction(['ivopetkov.form-element.image.TooBig']) . ';'
    . 'var ivoPetkovBearFrameworkAddonsFormElementsImageFormatBytes=' . $app->localization->getFormatBytesJsFunction() . ';'
    . '</script>';

echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('image', $attributes) . '>';
$labelElement = Utilities::getLabelElement($attributes);
if ($labelElement !== '') {
    echo '<label>';
    echo $labelElement;
    echo '</label>';
}
echo Utilities::getHintElement($attributes);
echo '<label for="' . htmlentities($elementID) . '" ' . Utilities::getElementAttributes($attributes) . '" style="' . htmlentities($labelStyle) . '" tabindex="0">';
echo '<span data-form-element-component="text">' . htmlspecialchars(strlen($value) > 0 ? (strlen($valuePreviewUrl) === 0 ? $value : '') : $chooseText) . '</span>';
if ($showClearButton) {
    echo '<span data-form-element-component="clear-button" title="' . htmlentities($clearButtonTitle) . '" style="display:' . (strlen($value) > 0 ? 'inline-block' : 'none') . ';" tabindex="0"></span>';
}
echo '</label>';
echo '<input name="' . htmlentities($name) . '" data-value="' . htmlentities($value) . '" id="' . htmlentities($elementID) . '" type="file" accept=".png,.jpg,.jpeg,.gif"' . ($maxSize !== '' ? ' data-form-element-data-max-size="' . $maxSize . '"' : '') . '>';
echo Utilities::getHintAfterElement($attributes);
//$js = file_get_contents(__DIR__ . '/../dev/api.image.js');
$js = include __DIR__ . '/image.api.min.js.php';
$js = str_replace('CHOOSE_TEXT_TO_REPLACE', $chooseText, $js);
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
