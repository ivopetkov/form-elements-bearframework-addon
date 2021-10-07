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

$valuePreviewUrl = (string) $component->valuePreviewUrl;
if (isset($attributes['valuepreviewurl'])) {
    unset($attributes['valuepreviewurl']);
}

$name = (string) $component->name;
if (isset($attributes['name'])) {
    unset($attributes['name']);
}

$elementID = 'fe' . md5(uniqid());
$attributes['data-form-element-component'] = 'button';

$labelStyle = '';
if (strlen($valuePreviewUrl) > 0) {
    $labelStyle = 'background-image:url(' . $valuePreviewUrl . ');';
}

$browseText = __('ivopetkov.form-element.image.Choose');

echo '<html><head>';
echo '<style>'
    . '[data-form-element-type="image"] > div{position:relative;}' // needed for the absolute positioned clear button
    . '[data-form-element-type="image"] [data-form-element-component="button"]{cursor:pointer;overflow:hidden;display:inline-block;background-repeat:no-repeat;background-position:center center;background-size:cover;}'
    . '[data-form-element-type="image"] [data-form-element-component="button"]>span{display:flex;width:100%;height:100%;align-items:center;justify-content:center;}'
    . '[data-form-element-type="image"] [data-form-element-component="clear-button"]{cursor:pointer;position:absolute;right:0;top:0;width:42px;height:42px;overflow:hidden;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;}'
    . '[data-form-element-type="image"] [data-form-element-component="clear-button"]>span{display:block;width:42px;height:42px;font-size:25px;color:#fff;text-shadow:#000 0 0 3px;transform:rotate(45deg);margin-top:9px;margin-left:5px;}'
    . '[data-form-element-type="image"] input{display:none;}'
    . Utilities::getDefaultStyles()
    . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('image', $attributes) . '>';
$labelElement = Utilities::getLabelElement($attributes);
if ($labelElement !== '') {
    echo '<label for="' . htmlentities($elementID) . '">';
    echo $labelElement;
    echo '</label>';
}
echo '<div>';
echo '<span data-form-element-component="clear-button" style="display:' . (strlen($value) > 0 ? 'inline-block' : 'none') . ';"><span>&#10010;</span></span>';
echo '<label for="' . htmlentities($elementID) . '" ' . Utilities::getElementAttributes($attributes) . '" style="' . htmlentities($labelStyle) . '"><span>' . htmlspecialchars(strlen($value) > 0 ? (strlen($valuePreviewUrl) === 0 ? $value : '') : $browseText) . '</span></label>';
echo '<input name="' . htmlentities($name) . '_files" id="' . htmlentities($elementID) . '" type="file" accept=".png,.jpg,.jpeg,.gif"/>';
echo '<input name="' . htmlentities($name) . '" value="' . htmlentities($value) . '" type="hidden"/>';
echo '</div>';
//$js = file_get_contents(__DIR__ . '/../dev/api.image.js');
$js = include __DIR__ . '/image.api.min.js.php';
$js = str_replace('CHOOSE_TEXT_TO_REPLACE', $browseText, $js);
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
